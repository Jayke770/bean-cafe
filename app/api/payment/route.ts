import { NextRequest, NextResponse } from "next/server";
import Paypal from "@/services/paypal";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
import Orders from '@/models/orders'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { orderPaid } from '@lib/utils'
import Twillio from '@/services/twilio'
const twillio = new Twillio()
const emailHandler = new Email("Bean Cafe")
import Email from '@/services/email';
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL } = process.env
const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: "sandbox"
})
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            await dbConnect()
            await paypal.authenticate()
            const type: "success" | "cancel" | "payNow" = req.nextUrl.searchParams.get("type") as any
            const payment_id = req.nextUrl.searchParams.get("token")
            const orderData = await Orders.findOne({ payment_id: { $eq: payment_id } })
            if (orderData && payment_id) {
                const params = `?orderId=${orderData.orderId}`
                if (type === "success") {
                    const data = await paypal.paymentDetails(payment_id)
                    if (data?.status === "APPROVED") {
                        await paypal.capturePayment(payment_id)
                        orderData.status = "pending"
                        orderData.isPaid = true
                        orderData.orderStatus.pop()
                        orderData.orderStatus.push("payment", "waiting_for_approval")
                        await orderData.save()
                        if (session?.user?.email) emailHandler.send({ receiver: session?.user?.email, subject: `Order ID ${orderData.orderId}`, body: orderPaid(orderData) })
                        if (session?.user?.phone_number) await twillio.sendMessage({ message: orderPaid(orderData, true), number: session?.user?.phone_number })
                        return NextResponse.redirect(`${NEXTAUTH_URL}/payment/success${params}`)
                    } else if (data?.status === "COMPLETED") {
                        return NextResponse.redirect(`${NEXTAUTH_URL}/payment/success${params}`)
                    } else {
                        return NextResponse.redirect(`${NEXTAUTH_URL}/payment/not-found${params}`)
                    }
                } else if (type === "payNow") {
                    const data = await paypal.paymentDetails(payment_id)
                    const paylink = data.links.find(x => x.rel === "payer-action")
                    return NextResponse.redirect(paylink?.href ?? NEXTAUTH_URL as string)
                } else {
                    orderData.status = "cancelled"
                    await orderData.save()
                    return NextResponse.redirect(`${NEXTAUTH_URL}/payment/cancelled${params}`)
                }
            } else {
                return NextResponse.redirect(`${NEXTAUTH_URL}/payment/not-found`)
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({}, { status: 500 })
    }
}
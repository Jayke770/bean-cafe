import { NextRequest, NextResponse } from "next/server";
import Paypal from "@/lib/paypal";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
import Orders from '@/models/orders'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
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
            const type: "success" | "cancel" = req.nextUrl.searchParams.get("type") as any
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
                        await orderData.save()
                        return NextResponse.redirect(`${NEXTAUTH_URL}/payment/success${params}`)
                    } else if (data?.status === "COMPLETED") {
                        return NextResponse.redirect(`${NEXTAUTH_URL}/payment/success${params}`)
                    } else {
                        return NextResponse.redirect(`${NEXTAUTH_URL}/payment/not-found${params}`)
                    }
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
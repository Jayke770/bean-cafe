import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import dbConnect from '@/models/dbConnect';
import Orders from '@/models/orders';
import { ApiResponse, OrderStatus } from '@/types'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error';
import addons from '@/models/addons';
import Twillio from '@/services/twilio'
import Paypal from '@/services/paypal'
import cart from '@/models/cart';
import { orderNotification } from '@/lib/notification';
import Email from '@/services/email';
import User from '@models/users'
const twillio = new Twillio()
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL, PAYPAL_MODE } = process.env
const emailHandler = new Email("Bean Cafe")
const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: PAYPAL_MODE as any
})
export const revalidate = 60;
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            await dbConnect()
            const status: OrderStatus | "all" = req.nextUrl.searchParams.get("status") as any
            const orderId = req.nextUrl.searchParams.get("id")
            if (orderId) {
                const orderData = await Orders.findOne({ orderId: { $eq: orderId }, userID: { $eq: session.user.id } })
                    .populate({
                        path: "items",
                        model: cart,
                        populate: { path: "addon", model: addons }
                    })
                return NextResponse.json(orderData)
            } else {
                const total_orders = await Orders.find({ userID: { $eq: session.user.id } }).count()
                const orders = await Orders.find(status === "all" ? { userID: { $eq: session.user.id } } : { userID: { $eq: session.user.id }, status: status })
                    .populate({
                        path: "items",
                        model: cart,
                        populate: { path: "addon", model: addons }
                    })
                    .sort({ _id: "desc" })
                return NextResponse.json({ total_orders, orders })
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
const CancelOrder = z.object({
    id: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    let res: ApiResponse = {}
    try {
        if (session) {
            await dbConnect()
            const formData = await req.json()
            const parse_form = CancelOrder.safeParse(formData)
            if (parse_form.success) {
                const orderData = await Orders.findOne({ orderId: { $eq: parse_form.data.id }, userID: { $eq: session.user.id } })
                const userData = await User.findOne({ _id: { $eq: orderData?.userID } })
                if (orderData && userData) {
                    orderData.status = "cancelled"
                    if (orderData.payment_method === "paypal" && orderData.isPaid) {
                        await paypal.authenticate()
                        const data = await paypal.paymentDetails(orderData?.payment_id ?? "")
                        await paypal.refund(data.purchase_units[0].payments.captures[0].id)
                        orderData.isRefunded = true
                        orderData.orderStatus.push("refunded")
                    }
                    await orderData.save()
                    const notification = await orderNotification(orderData.orderId)
                    if (userData.email) {
                        emailHandler.send({
                            receiver: userData.email,
                            subject: `Order ID ${orderData.orderId}`,
                            body: notification.email
                        })
                    }
                    if (userData?.phone_number) {
                        await twillio.sendMessage({
                            message: notification.sms,
                            number: userData.phone_number
                        })
                    }
                    res = {
                        status: true,
                        message: "Order Successfully Cancelled"
                    }
                    return NextResponse.json(res);
                } else {
                    res = {
                        status: false,
                        message: "Order Not Found"
                    }
                    return NextResponse.json(res);
                }
            } else {
                res = {
                    status: false,
                    message: fromZodError(parse_form.error, { prefix: null }).message
                }
                return NextResponse.json(res);
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({}, { status: 500 })
    }
}
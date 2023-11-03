import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/models/dbConnect'
import Orders from '@/models/orders'
import Cart from '@/models/cart'
import Addons from '@/models/addons'
import users from '@models/users'
import { ApiResponse, OrderStatus } from '@/types'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { orderNotification } from '@lib/notification'
import * as changeCase from 'change-case'
import Paypal from '@/services/paypal'
import Email from '@/services/email'
import User from '@models/users'
import Twillio from '@/services/twilio'
import { DELIVERY_FEE } from '@/lib/constants'
import items from '@/models/items'
const twillio = new Twillio()
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL, PAYPAL_MODE } = process.env
const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: PAYPAL_MODE as any
})
const emailHandler = new Email("Bean Cafe")
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    const type: "orders" | "stats" = req.nextUrl.searchParams.get("type") as any
    const orderId = req.nextUrl.searchParams.get("id")
    const status: OrderStatus | undefined | null | "all" = req.nextUrl.searchParams.get("status") as any
    try {
        if (session) {
            await dbConnect()
            if (type === "orders") {
                let data: any
                if (orderId) {
                    data = await Orders.findOne({ orderId: { $eq: orderId } })
                        .populate({
                            path: "items", model: Cart,
                            populate: { path: "addon", model: Addons }
                        })
                        .populate({ path: "userID", model: users, select: "-orders -password -cart" })
                        .sort({ _id: "desc" })
                } else {
                    data = await Orders.find(status === "all" ? {} : { status: { $eq: status } })
                        .populate({ path: "userID", model: users, select: "-orders -password -cart" })
                        .populate({
                            path: "items", model: Cart,
                            populate: { path: "addon", model: Addons }
                        })
                        .sort({ _id: "desc" })
                }
                return NextResponse.json(data)
            } else if (type === "stats") {
                const orders = await Orders.find({}, { status: 1 })
                const completed = orders.reduce((sum, order) => sum + (order.status === "completed" ? 1 : 0), 0)
                const cancelled = orders.reduce((sum, order) => sum + (order.status === "cancelled" ? 1 : 0), 0)
                const denied = orders.reduce((sum, order) => sum + (order.status === "denied" ? 1 : 0), 0)
                const pending = orders.reduce((sum, order) => sum + (order.status === "pending" ? 1 : 0), 0)
                return NextResponse.json({
                    completed,
                    cancelled,
                    denied,
                    pending
                })
            } else {
                return NextResponse.json({}, { status: 401 })
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 })
    }
}
const formData = z.object({
    type: z.union([
        z.literal("approve"),
        z.literal("disapprove"),
        z.literal("cancel"),
        z.literal("delivered"),
        z.literal("out_for_delivery")
    ]),
    orderId: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    let res: ApiResponse = {}
    try {
        if (session) {
            await dbConnect()
            await paypal.authenticate()
            const data = formData.safeParse(await req.json())
            if (data?.success) {
                const orderData = await Orders.findOne({ orderId: { $eq: data.data.orderId } }).populate({ path: "items", model: Cart, populate: { path: "addon", model: Addons } })
                const userData = await User.findOne({ _id: { $eq: orderData?.userID } })
                if (orderData && userData) {
                    // if the order is pending only allow approve or disapprove
                    if (orderData.status === "pending") {
                        if (data.data.type === "approve") {
                            orderData.status = "processing"
                            orderData.isApproved = true
                            orderData.orderStatus.pop()
                            orderData.orderStatus.push("order_approve", "processing")
                            if (orderData.payment_method === "cash_on_delivery") orderData.isPaid = true
                            await orderData.save()
                            const notification = await orderNotification(orderData.orderId)
                            if (userData?.email) {
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
                                message: `Order ${changeCase.sentenceCase(data.data.type)}`
                            }
                            return NextResponse.json(res)
                        } else if (data.data.type === "disapprove") {
                            orderData.status = "denied"
                            orderData.isApproved = false
                            orderData.orderStatus.pop()
                            orderData.payment_method === "cash_on_delivery" ? orderData.orderStatus.push("disapprove") : orderData.orderStatus.push("disapprove", "waiting_for_refund")
                            //if paypal send refund 
                            if (orderData.payment_method === "paypal") {
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
                                message: `Order ${changeCase.sentenceCase(data.data.type)}`
                            }
                            return NextResponse.json(res)
                        } else {
                            return NextResponse.json({}, { status: 401 })
                        }
                    } else {
                        if (data.data.type === "cancel") {
                            orderData.status = "cancelled"
                            orderData.orderStatus.push("cancelled")
                            if (orderData.payment_method === "paypal") {
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
                                message: `Order ${changeCase.sentenceCase(orderData.status)}`
                            }
                            return NextResponse.json(res)
                        } else if (data.data.type === "out_for_delivery") {
                            orderData.status = "out for delivery"
                            orderData.orderStatus.push("out_for_delivery")
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
                                message: `Order ${changeCase.sentenceCase(orderData.status)}`
                            }
                            return NextResponse.json(res)
                        } else if (data.data.type === "delivered") {
                            orderData.status = "completed"
                            orderData.orderStatus.push("delivered")
                            for (const item of orderData.items) {
                                const ItemData = await items.findOne({ item_id: { $eq: item.item_id } })
                                if (ItemData) {
                                    ItemData.sold += item.quantity
                                    if (item?.size) {
                                        const ItemIndex = ItemData.sizes.findIndex(x => x.type === item.size)
                                        if (ItemIndex >= 0) ItemData.sizes[ItemIndex].stocks -= item.quantity
                                    }
                                    await ItemData.save()
                                }
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
                                message: `Order ${changeCase.sentenceCase(orderData.status)}`
                            }
                            return NextResponse.json(res)
                        } else {
                            res = {
                                status: false,
                                message: `Order is ${changeCase.sentenceCase(orderData.status)}`
                            }
                            return NextResponse.json(res)
                        }
                    }
                } else {
                    res = {
                        status: false,
                        message: "Order Not Found"
                    }
                    return NextResponse.json(res)
                }
            } else {
                return NextResponse.json({
                    status: false,
                    message: fromZodError(data.error).message,
                });
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({}, { status: 500 })
    }
}
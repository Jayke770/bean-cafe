import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { z } from 'zod'
import dbConnect from '@/models/dbConnect';
import Users from '@/models/users';
import Orders from '@/models/orders';
import Cart from '@models/cart'
import { ApiResponse, CreateOrder } from '@/types';
import Email from '@/services/email';
import { fromZodError } from 'zod-validation-error';
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { orderNotification } from '@lib/utils'
import Paypal from "@/services/paypal";
import { DELIVERY_FEE } from "@lib/constants"
import Twillio from '@/services/twilio'
const twillio = new Twillio()
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL, PAYPAL_MODE, PAYPAL_CURRENCY_CODE } = process.env
const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: PAYPAL_MODE as any
})
const emailHandler = new Email("Bean Cafe")
const UserCartData = z.object({
    _id: z.any(),
    cart_id: z.string(),
    item_id: z.string(),
    quantity: z.number(),
    size: z.string().optional().or(z.null()),
    item_name: z.string(),
    price: z.number(),
    category: z.string(),
    created: z.number()
})
const DeliveryService = z.union([z.literal("pickup"), z.literal("deliver")])
const PaymentMethod = z.union([
    z.literal("gcash"),
    z.literal("paypal"),
    z.literal("cash_on_delivery"),
])
const CheckOutSchema = z.object({
    items: z.array(UserCartData),
    payment_method: PaymentMethod,
    phone_number: z.string(),
    address: z.string().optional(),
    name: z.string().optional(),
    message: z.string().optional(),
    gcash_image: z.any().optional(),
    delivery_service: DeliveryService
})
export async function POST(req: NextRequest) {
    const { formData } = req
    const session = await getServerSession(AuthOptions)
    let res: ApiResponse = {}
    try {
        if (session) {
            const form_data = await formData()
            const parse_form = CheckOutSchema.safeParse({
                items: JSON.parse(form_data.get("items") as any),
                payment_method: form_data.get("payment_method"),
                gcash_image: form_data.get("gcash_image"),
                address: form_data.get("address"),
                name: form_data.get("name"),
                message: form_data.get("message"),
                phone_number: form_data.get("phone_number"),
                delivery_service: form_data.get("delivery_service")
            })
            if (parse_form.success) {
                await dbConnect()
                if (parse_form.data.payment_method === "cash_on_delivery") {
                    const userData = await Users.findOne({ _id: { $eq: session.user.id } })
                        .populate({
                            path: "cart",
                            match: { _id: { $in: parse_form.data.items.map(item => item._id) }, status: { $ne: "ordered" } },
                            populate: { path: "addon" }
                        })
                    if (userData) {
                        const total_payment = parse_form.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        //save to order collection
                        const orderData = await Orders.create({
                            created: parseFloat(moment().format("x")),
                            items: parse_form.data.items.map(item => (item._id)),
                            orderId: nanoid().toUpperCase(),
                            status: "pending",
                            payment_method: parse_form.data.payment_method,
                            userID: session.user.id,
                            total_payment: total_payment.toString(),
                            name: parse_form.data.name,
                            orderStatus: ["order_placed", "waiting_payment"],
                            message: parse_form.data.message,
                            address: parse_form.data.address,
                            phone_number: parse_form.data.phone_number,
                            fee: DELIVERY_FEE,
                            deliveryType: parse_form.data.delivery_service
                        })
                        userData.orders.push(orderData.id)
                        await userData.save()
                        //remove item in user cart 
                        await Users.updateOne({
                            _id: { $eq: session.user.id },
                            cart: { $in: parse_form.data.items.map(item => item._id) }
                        }, {
                            $pull: { cart: { $in: parse_form.data.items.map(item => item._id) } }
                        })
                        //update cart 
                        await Cart.updateMany({ _id: { $in: parse_form.data.items.map(item => item._id) } }, { $set: { status: "ordered" } })
                        //send notification
                        if (userData.email) emailHandler.send({ receiver: userData.email, subject: `Order ID ${orderData.orderId}`, body: orderNotification(orderData) })
                        if (userData?.phone_number) await twillio.sendMessage({ message: orderNotification(orderData, true), number: userData.phone_number })
                        res = {
                            status: true,
                            message: "Order Success"
                        }
                        return NextResponse.json(res)
                    } else {
                        res = {
                            status: false,
                            message: "Item Not Found"
                        }
                        return NextResponse.json(res);
                    }
                } else if (parse_form.data.payment_method === "paypal") {
                    const userData = await Users.findOne({ _id: { $eq: session.user.id } })
                        .populate({
                            path: "cart",
                            match: { _id: { $in: parse_form.data.items.map(item => item._id) }, status: { $ne: "ordered" } },
                            populate: { path: "addon" }
                        })
                    if (userData) {
                        const total_payment = userData.cart?.reduce((sum, item) => sum + (item.price * item.quantity) + (item?.addon?.price ?? 0), 0)
                        let purchase_items: CreateOrder['purchase_units'][0]['items'] = []
                        userData.cart.map(item => {
                            purchase_items?.push({
                                name: item.item_name,
                                quantity: item.quantity.toString(),
                                description: item.item_name,
                                unit_amount: {
                                    currency_code: PAYPAL_CURRENCY_CODE as string,
                                    value: item.price.toString()
                                }
                            })
                            if (item.addon) {
                                purchase_items?.push({
                                    name: item.addon.name,
                                    quantity: "1",
                                    description: "",
                                    unit_amount: {
                                        currency_code: PAYPAL_CURRENCY_CODE as string,
                                        value: item.addon.price.toString()
                                    }
                                })
                            }
                        })
                        console.log(total_payment, parse_form.data.delivery_service === "deliver" ? DELIVERY_FEE : 0)
                        const createPaypalOrder: CreateOrder = {
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    items: purchase_items,
                                    amount: {
                                        currency_code: PAYPAL_CURRENCY_CODE as string,
                                        value: (total_payment + (parse_form.data.delivery_service === "deliver" ? DELIVERY_FEE : 0)).toString(),
                                        breakdown: {
                                            item_total: {
                                                currency_code: PAYPAL_CURRENCY_CODE as string,
                                                value: total_payment.toString()
                                            },
                                            shipping: {
                                                currency_code: PAYPAL_CURRENCY_CODE as string,
                                                value: parse_form.data.delivery_service === "deliver" ? DELIVERY_FEE.toString() : "0"
                                            }
                                        }
                                    }
                                }
                            ],
                            payment_source: {
                                paypal: {
                                    experience_context: {
                                        brand_name: "Bean Cafe",
                                        cancel_url: `${NEXTAUTH_URL}/api/payment?type=cancel`,
                                        return_url: `${NEXTAUTH_URL}/api/payment?type=success`,
                                        payment_method_selected: "PAYPAL",
                                        user_action: "PAY_NOW"
                                    }
                                }
                            }
                        }
                        console.log(createPaypalOrder.purchase_units[0].amount)
                        //authenticate paypal 
                        await paypal.authenticate()
                        //create payment order 
                        const payment_order = await paypal.createPayment(createPaypalOrder)
                        console.log(payment_order)
                        if (payment_order.status === "PAYER_ACTION_REQUIRED") {
                            const redirect_url = payment_order.links.find(x => x.rel === "payer-action")
                            //save to order collection
                            const orderData = await Orders.create({
                                created: parseFloat(moment().format("x")),
                                items: parse_form.data.items,
                                orderId: nanoid().toUpperCase(),
                                status: "pending",
                                payment_method: parse_form.data.payment_method,
                                userID: session.user.id,
                                total_payment: total_payment.toString(),
                                payment_id: payment_order.id,
                                name: parse_form.data.name,
                                orderStatus: ["order_placed", "waiting_payment"],
                                message: parse_form.data.message,
                                address: parse_form.data.address,
                                phone_number: parse_form.data.phone_number,
                                fee: DELIVERY_FEE,
                                deliveryType: parse_form.data.delivery_service
                            })
                            userData.orders.push(orderData.id)
                            await userData.save()
                            //remove item in user cart 
                            await Users.updateOne({
                                _id: { $eq: session.user.id },
                                cart: { $in: parse_form.data.items.map(item => item._id) }
                            }, {
                                $pull: { cart: { $in: parse_form.data.items.map(item => item._id) } }
                            })
                            //update cart 
                            await Cart.updateMany({ _id: { $in: parse_form.data.items.map(item => item._id) } }, { $set: { status: "ordered" } })
                            //send notification
                            if (userData?.email) emailHandler.send({ receiver: userData.email, subject: `Order ID ${orderData.orderId}`, body: orderNotification(orderData) })
                            if (userData?.phone_number) await twillio.sendMessage({ message: orderNotification(orderData, true), number: userData.phone_number })
                            res = {
                                status: true,
                                message: "Order Success",
                                redirect_url: redirect_url?.href
                            }
                            return NextResponse.json(res)
                        } else {
                            res = {
                                status: false,
                                message: "Failed to checkout"
                            }
                            return NextResponse.json(res)
                        }
                    } else {
                        res = {
                            status: false,
                            message: "Item Not Found"
                        }
                        return NextResponse.json(res);
                    }
                } else {
                    res = {
                        status: false,
                        message: `${changeCase.sentenceCase(parse_form.data.payment_method)} is not yet available.`
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
            return NextResponse.json({}, { status: 500 });
        }
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({}, { status: 500 });
    }
}
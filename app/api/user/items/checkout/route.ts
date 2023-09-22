import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { z } from 'zod'
import dbConnect from '@/models/dbConnect';
import Users from '@/models/users';
import Orders from '@/models/orders';
import { ApiResponse } from '@/types';
import Email from '@/services/email';
import { fromZodError } from 'zod-validation-error';
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import { nanoid } from 'nanoid';
const emailHandler = new Email("Bean Cafe")
const UserCartData = z.object({
    id: z.string(),
    item_id: z.string(),
    quantity: z.number(),
    size: z.string().optional().or(z.null()),
    item_name: z.string(),
    price: z.number(),
    category: z.string(),
    created: z.number()
})
type gsgas = z.infer<typeof UserCartData>
const CheckOutSchema = z.object({
    items: z.array(UserCartData),
    payment_method: z.union([
        z.literal("gcash"),
        z.literal("paypal"),
        z.literal("cash"),
    ]),
    gcash_image: z.any().optional()
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
                gcash_image: form_data.get("gcash_image")
            })
            if (parse_form.success) {
                if (parse_form.data.payment_method === "cash") {
                    await dbConnect()
                    //add to order key 
                    const userData = await Users.findOne({
                        _id: { $eq: session.user.id },
                        $and: parse_form.data.items.map(item => ({ cart: { $elemMatch: { id: item.id } } }))
                    })
                    if (userData) {
                        const total_payment = parse_form.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        userData.orders.push({
                            created: parseFloat(moment().format("x")),
                            id: nanoid().toUpperCase(),
                            items: parse_form.data.items,
                            status: "pending",
                            total_payment: total_payment.toString(),
                            payment_method: parse_form.data.payment_method
                        })
                        await userData.save()
                        //save to order collection
                        await Orders.create({
                            created: parseFloat(moment().format("x")),
                            items: parse_form.data.items,
                            orderId: nanoid().toUpperCase(),
                            status: "pending",
                            payment_method: parse_form.data.payment_method,
                            userID: session.user.id
                        })
                        //remove item in user cart 
                        await Users.updateOne({
                            _id: { $eq: session.user.id },
                            $and: parse_form.data.items.map(item => ({ cart: { $elemMatch: { id: item.id } } }))
                        }, {
                            $pull: {
                                cart: {
                                    id: { $in: parse_form.data.items.map(item => item.id) }
                                }
                            }
                        })
                        res = {
                            status: true,
                            message: "Order Success"
                        }
                        return NextResponse.json(res)
                    } else {
                        return NextResponse.json({}, { status: 401 });
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
        return NextResponse.json({}, { status: 500 });
    }
}
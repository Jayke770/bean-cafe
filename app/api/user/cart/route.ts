import { type NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import { ApiResponse, UserCart } from "@/types";
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { fromZodError } from "zod-validation-error";
import Item from '@models/items'
import User from '@models/users'
import moment from "moment-timezone";
import { nanoid } from "nanoid";
import dbConnect from "@/models/dbConnect";
const schema = z.object({
    item_id: z.string(),
    quantity: z.number(),
    selected_size: z.string().optional()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    let res: ApiResponse = {}
    try {
        if (session) {
            const item_data = await req.json()
            const validatedData = schema.safeParse(item_data)
            if (validatedData.success) {
                const { data } = validatedData
                await dbConnect()
                const itemData = await Item.findOne({ item_id: { $eq: data.item_id } })
                if (itemData) {
                    //check if the item is already added to cart 
                    const isAlreadyAdded = await User.findOne({
                        _id: { $eq: session.user.id },
                        cart: { $elemMatch: { item_id: { $eq: data.item_id } } }
                    }, { cart: { $elemMatch: { item_id: { $eq: data.item_id } } } })
                    if (isAlreadyAdded) {
                        await User.updateOne({
                            _id: { $eq: session.user.id },
                            cart: { $elemMatch: { item_id: { $eq: data.item_id } } }
                        }, {
                            $inc: { "cart.$.quantity": data.quantity }
                        })
                    } else {
                        const new_user_cart: UserCart = {
                            created: parseFloat(moment().format("x")),
                            id: nanoid().toUpperCase(),
                            item_id: itemData.item_id,
                            quantity: data.quantity,
                            category: itemData.category,
                            size: data.selected_size,
                            item_name: itemData.name,
                            price: itemData.price
                        }
                        await User.updateOne({ _id: { $eq: session.user.id } }, { $push: { cart: new_user_cart } })
                    }
                    res.message = "Successfully added to cart!"
                    res.status = true
                    return NextResponse.json(res)
                } else {
                    res.message = "Item Not Found"
                    res.status = false
                    return NextResponse.json(res)
                }
            } else {
                const error = fromZodError(validatedData.error, { prefix: null }).message;
                return NextResponse.json({
                    status: false,
                    message: fromZodError(validatedData.error).message,
                });
            }
        } else {
            return NextResponse.json({}, { status: 401 });
        }
    } catch (e: any) {
        return NextResponse.json({}, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            await dbConnect()
            const cart_data = await User.findOne({ _id: { $eq: session.user.id } }, { cart: 1, _id: 0 })
            return NextResponse.json(cart_data?.cart)
        } else {
            return NextResponse.json({}, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 });
    }
}
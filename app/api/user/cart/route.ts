import { type NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import { ApiResponse, UserCart } from "@/types";
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { fromZodError } from "zod-validation-error";
import Item from '@models/items'
import User from '@models/users'
import Cart from '@models/cart'
import moment from "moment-timezone";
import { nanoid } from "nanoid";
import dbConnect from "@/models/dbConnect";
import addons from "@/models/addons";
import carts from '@/models/cart'
const schema = z.object({
    item_id: z.string(),
    addon: z.string(),
    quantity: z.number().gt(0, "Invalid Quantity"),
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
                const userData = await User.findOne({ _id: { $eq: session.user.id } })
                if (userData) {
                    const itemData = await Item.findOne({ item_id: { $eq: data.item_id } })
                    if (itemData) {
                        //check if the item is already added to cart 
                        const itemInCart = await Cart.findOne({
                            item_id: { $eq: data.item_id },
                            size: { $eq: data.selected_size },
                            status: { $ne: "ordered" }
                        })
                        if (itemInCart) {
                            itemInCart.quantity += data.quantity
                            await itemInCart.save()
                        } else {
                            let price = 0
                            if (itemData.sizes.length <= 0 && itemData.price) {
                                price = itemData.price
                            } else {
                                const selected_size_data = itemData.sizes.find(x => x.type === data.selected_size)
                                if (selected_size_data) {
                                    price = selected_size_data?.price
                                } else {
                                    res.message = "Something went wrong!"
                                    res.status = false
                                    return NextResponse.json(res)
                                }
                            }
                            const addonData = await addons.findOne({ id: { $eq: data.addon } })
                            if (addonData) {
                                const newCartItem = await Cart.create({
                                    user_id: userData._id,
                                    created: parseFloat(moment().format("x")),
                                    cart_id: nanoid().toUpperCase(),
                                    item_id: itemData.item_id,
                                    quantity: data.quantity,
                                    category: itemData.category,
                                    size: data.selected_size,
                                    item_name: itemData.name,
                                    price: price,
                                    status: "not-ordered",
                                    addon: addonData?._id
                                })
                                userData.cart.push(newCartItem._id)
                                await userData.save()
                            } else {
                                res.message = "Invalid Addon"
                                res.status = false
                                return NextResponse.json(res)
                            }
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
                    return NextResponse.json({}, { status: 401 });
                }
            } else {
                return NextResponse.json({
                    status: false,
                    message: fromZodError(validatedData?.error, { prefix: null }).message,
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
            const cart_data = await carts.find({ user_id: { $eq: session.user.id }, status: { $ne: "ordered" } })
                .populate({
                    path: "addon"
                })
            return NextResponse.json(cart_data)
        } else {
            return NextResponse.json({}, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 });
    }
}
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { nanoid } from "nanoid";
import dbConnect from "@/models/dbConnect";
import addons from "@/models/addons";
import items from "@/models/items";
import moment from "moment";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
import { ApiResponse } from "@/types";
const UpdatePriceSchema = z.object({
    id: z.string(),
    type: z.string(),
    price: z.number().gt(0)
})
const AddNewPriceSchema = z.object({
    id: z.string(),
    sizes: z.array(z.object({
        stocks: z.number(),
        price: z.number(),
        type: z.string(),
    }))
})
const PriceDeleteSchema = z.object({
    id: z.string(),
    size: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    let res: ApiResponse = { status: false }
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const type = req.nextUrl.searchParams.get("type")
            if (type === "new") {
                const validated_data = AddNewPriceSchema.safeParse(await req.json())
                if (validated_data?.success) {
                    const itemData = await items.findOne({ item_id: { $eq: validated_data.data.id } })
                    if (itemData) {
                        itemData.price = undefined
                        itemData.sizes = [...itemData.sizes, ...validated_data.data.sizes]
                        await itemData.save()
                        return NextResponse.json({ ...res, status: true, message: "Successfully Updated" });
                    } else {
                        return NextResponse.json({ ...res, status: false, message: "Item Not Found" });
                    }
                } else {
                    return NextResponse.json({ ...res, message: fromZodError(validated_data.error, { prefix: null }).message });
                }
            } else {
                const validated_data = UpdatePriceSchema.safeParse(await req.json())
                if (validated_data.success) {
                    await dbConnect()
                    const itemData = await items.findOne({ item_id: { $eq: validated_data.data.id } })
                    if (itemData) {
                        if (validated_data.data.type === "regular") {
                            await items.updateOne({
                                item_id: { $eq: validated_data.data.id }
                            }, {
                                $set: { price: validated_data.data.price }
                            })
                            return NextResponse.json({ ...res, status: true, message: "Price Successfully Updated" });
                        } else if (validated_data.data.type !== "regular" && (itemData.sizes.length ?? 0) > 0) {
                            await items.updateOne({
                                item_id: { $eq: validated_data.data.id },
                                sizes: {
                                    $elemMatch: { type: validated_data.data.type }
                                }
                            }, {
                                $set: { "sizes.$.price": validated_data.data.price }
                            })
                            return NextResponse.json({ ...res, status: true, message: "Price Successfully Updated" });
                        } else {
                            return NextResponse.json({ ...res, message: "Invalid Item" });
                        }
                    } else {
                        return NextResponse.json({ ...res, message: "Item Not Found" });
                    }
                } else {
                    return NextResponse.json({ ...res, message: fromZodError(validated_data.error, { prefix: null }).message });
                }
            }
        } else {
            return NextResponse.json(null, { status: 401 });
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json(null, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    let res: ApiResponse = { status: false }
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const validated_data = PriceDeleteSchema.safeParse(await req.json())
            if (validated_data.success) {
                const data = await items.updateOne({
                    item_id: validated_data.data.id,
                    sizes: { $elemMatch: { type: validated_data.data.size.toLowerCase() } }
                }, {
                    $pull: { sizes: { type: validated_data.data.size.toLowerCase() } }
                })
                return NextResponse.json({ ...res, status: true, message: "Size Deleted" });
            } else {
                return NextResponse.json({ ...res, message: fromZodError(validated_data.error, { prefix: null }).message });
            }
        } else {
            return NextResponse.json(null, { status: 401 });
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json(null, { status: 500 });
    }
}
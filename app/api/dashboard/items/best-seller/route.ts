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
const BestSellerSchema = z.object({
    id: z.string()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    let res: ApiResponse = { status: false }
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const parse_data = BestSellerSchema.safeParse(await req.json())
            if (parse_data.success) {
                await dbConnect()
                const ItemData = await items.findOne({ item_id: { $eq: parse_data.data.id } })
                if (ItemData) {
                    ItemData.isBestSeller = !ItemData.isBestSeller
                    await ItemData.save()
                    return NextResponse.json({ ...res, status: true, message: "Item Successfully Updated" })
                } else {
                    return NextResponse.json({ ...res, message: "Item Not Found" })
                }
            } else {
                return NextResponse.json({ ...res, message: fromZodError(parse_data.error, { prefix: null }).message });
            }
        } else {
            return NextResponse.json(null, { status: 401 });
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json(null, { status: 500 });
    }
}
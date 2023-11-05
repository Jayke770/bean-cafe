import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/dbConnect";
import Items from "@/models/items";
import orders from "@/models/orders";
import addons from "@/models/addons";
import cart from '@/models/cart'
import Users from "@models/users";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
export const revalidate = 60;
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    try {
        if (session) {
            await dbConnect();
            const userid = req.nextUrl.searchParams.get("id")
            const type: "user-info" | "user-orders" | "user-cart" = req.nextUrl.searchParams.get("type") as any
            let data: any
            if (type === "user-info") {
                data = await Users.findOne({ _id: { $eq: userid } }, { password: 0 })
            } else if (type === "user-cart") {
                data = await cart.find({ user_id: { $eq: userid } }).populate({ path: "addon", model: addons })
            } else if (type === "user-orders") {
                data = await orders.find({ userID: { $eq: userid } }).populate({ path: "items", model: cart, populate: { path: "addon", model: addons } })
            } else {
                data = await Users.find({}, { password: 0 })
            }
            return NextResponse.json(data);
        } else {
            return NextResponse.json({}, { status: 401 });
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, { status: 500 });
    }
}

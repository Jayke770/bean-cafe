import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/dbConnect";
import Items from "@/models/items";
import orders from "@/models/orders";
import addons from "@/models/addons";
import cart from '@/models/cart'
import Users from "@models/users";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
import type { ApiResponse } from "@/types";
import { z } from 'zod'
import { fromZodError } from "zod-validation-error";
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
const UpdateRoleSchema = z.object({
    id: z.string(),
    role: z.union([z.literal("admin"), z.literal("user"), z.literal("staff")])
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions);
    let res: ApiResponse = {}
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            await dbConnect()
            const type: "update-role" = req.nextUrl.searchParams.get("type") as any
            if (type === "update-role") {
                const validated_data = UpdateRoleSchema.safeParse(await req.json())
                if (validated_data.success) {
                    const UserData = await Users.findOne({ _id: { $eq: validated_data.data.id } })
                    if (UserData) {
                        UserData.role = validated_data.data.role
                        await UserData.save()
                        return NextResponse.json({
                            ...res,
                            status: true,
                            message: "Role Successfully Updated"
                        });
                    } else {
                        return NextResponse.json({
                            ...res,
                            status: false,
                            message: "User Not Found"
                        });
                    }
                } else {
                    return NextResponse.json({
                        ...res,
                        status: false,
                        message: fromZodError(validated_data?.error, { prefix: null }).message,
                    });
                }
            } else {
                return NextResponse.json({ ...res, status: false, message: "Invalid Request" });
            }
        } else {
            return NextResponse.json({}, { status: 401 });
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, { status: 500 });
    }
}
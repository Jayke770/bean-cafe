import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import { getServerSession } from "next-auth";
import { AuthOptions } from "@services/NextAuth/AuthOptions";
import dbConnect from "@/models/dbConnect";
import categories from "@/models/categories";
import { fromZodError } from "zod-validation-error";
import moment from "moment-timezone";
import items from "@/models/items";
const CategorySchema = z.object({
    category: z.string().nonempty()
})
const DeleteCategorySchema = z.object({
    id: z.string().nonempty()
})
export async function POST(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const data = await req.json()
            const parse_data = CategorySchema.safeParse(data)
            if (parse_data.success) {
                const category = new RegExp(parse_data.data.category, "i")
                await dbConnect()
                const category_data = await categories.findOne({ type: { $regex: category } })
                if (!category_data) {
                    await categories.create({
                        created: parseFloat(moment().format("x")),
                        type: parse_data.data.category
                    })
                    return NextResponse.json({
                        status: true,
                        message: "Category Added"
                    });
                } else {
                    return NextResponse.json({
                        status: false,
                        message: "Category already added"
                    });
                }
            } else {
                return NextResponse.json({
                    status: false,
                    message: fromZodError(parse_data.error).message,
                });
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e: any) {
        return NextResponse.json({ status: false, message: e.message });
    }
}
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            const data = await req.json()
            const parse_data = DeleteCategorySchema.safeParse(data)
            if (parse_data.success) {
                await dbConnect()
                const category_data = await categories.findOne({ _id: { $eq: parse_data.data.id } })
                if (category_data) {
                    const hasItem = await items.findOne({ category: { $eq: category_data?.type } })
                    if (hasItem) {
                        return NextResponse.json({
                            status: false,
                            message: "Category is in use"
                        });
                    } else {
                        await category_data.deleteOne()
                        return NextResponse.json({
                            status: true,
                            message: "Category Deleted"
                        });
                    }
                } else {
                    return NextResponse.json({
                        status: false,
                        message: "Category Not Found"
                    });
                }
            } else {
                return NextResponse.json({
                    status: false,
                    message: fromZodError(parse_data.error).message,
                });
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e: any) {
        return NextResponse.json({ status: false, message: e.message });
    }
}
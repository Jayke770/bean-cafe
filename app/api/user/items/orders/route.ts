import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import dbConnect from '@/models/dbConnect';
import Users from '@/models/users';
import Orders from '@/models/orders';
import { OrderStatus } from '@/types'
export const revalidate = 60;
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            await dbConnect()
            const status: OrderStatus = req.nextUrl.searchParams.get("type") as any ?? "pending"
            const orders = await Orders.find({ userID: { $eq: session.user.id }, status: status })
            return NextResponse.json(orders)
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 })
    }
}
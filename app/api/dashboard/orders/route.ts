import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/models/dbConnect'
import Orders from '@/models/orders'
import { OrderStatus } from '@/types'
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    const type: "orders" | "stats" = req.nextUrl.searchParams.get("type") as any
    const status: OrderStatus | undefined | null = req.nextUrl.searchParams.get("status") as any
    try {
        if (session) {
            await dbConnect()
            if (type === "orders") {
                const data = await Orders.find({ status: { $eq: status ?? "pending" } }).sort({ _id: "desc" })
                return NextResponse.json(data)
            } else if (type === "stats") {
                const orders = await Orders.find({}, { status: 1 })
                const completed = orders.reduce((sum, order) => sum + (order.status === "completed" ? 1 : 0), 0)
                const cancelled = orders.reduce((sum, order) => sum + (order.status === "cancelled" ? 1 : 0), 0)
                const denied = orders.reduce((sum, order) => sum + (order.status === "denied" ? 1 : 0), 0)
                const pending = orders.reduce((sum, order) => sum + (order.status === "pending" ? 1 : 0), 0)
                return NextResponse.json({
                    completed,
                    cancelled,
                    denied,
                    pending
                })
            } else {
                return NextResponse.json({}, { status: 401 })
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 })
    }
}
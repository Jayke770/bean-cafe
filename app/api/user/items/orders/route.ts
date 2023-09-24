import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import dbConnect from '@/models/dbConnect';
import Users from '@/models/users';
export const revalidate = 60;
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            await dbConnect()
            const userData = await Users.findOne({ _id: { $eq: session?.user?.id } }, { orders: 1 })
            return NextResponse.json(userData?.orders)
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 })
    }
}
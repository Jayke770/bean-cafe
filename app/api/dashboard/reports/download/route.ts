import { NextRequest, NextResponse } from "next/server";
import chartJsImage from 'chartjs-to-image'
import { getServerSession } from 'next-auth'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
const chart = new chartJsImage()
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {

        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 })
    }
}
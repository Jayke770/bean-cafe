import { NextRequest, NextResponse } from "next/server";
import Paypal from "@/lib/paypal";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
import Orders from '@/models/orders'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import { getServerSession } from 'next-auth'
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL } = process.env
const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: "sandbox"
})
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session) {
            await dbConnect()
            await paypal.authenticate()
            const payment_id = req.nextUrl.searchParams.get("token")
            const orderData = await Orders.findOne({ payment_id: { $eq: payment_id } })
            if (orderData && payment_id) {
                const data = await paypal.capturePayment(payment_id)
                return NextResponse.redirect("/payment/success")
            } else {
                return NextResponse.redirect("/payment/not-found")
            }
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({}, { status: 500 })
    }
}
import { NextResponse } from 'next/server'
import Paypal from '@/services/paypal'
import Twillio from '@/services/twilio'
const twillio = new Twillio()
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL } = process.env
const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: "sandbox"
})
export async function GET() {
    // const data = await twillio.sendMessage({ message: "Hi by", number: "+639553389297" })
    // console.log(data)
    return NextResponse.json({})
}
import { NextResponse } from 'next/server'
import Paypal from '@/services/paypal'
import Twillio from '@/services/sms'
const twillio = new Twillio()
const { PAYPAL_SECRET, PAYPAL_CLIENT_ID, NEXTAUTH_URL } = process.env

const paypal = new Paypal({
    client_secret: PAYPAL_SECRET as string,
    client_id: PAYPAL_CLIENT_ID as string,
    mode: "sandbox"
})
export async function GET() {
    // const data = await twillio.sendMessage({ message: "tesfsat\nfsfag", number: "+639051697081" })
    // console.log(data)
    return NextResponse.json({})
}
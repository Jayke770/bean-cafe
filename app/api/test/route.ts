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
    // const data = await twillio.sendMessage({ message: "nodejs", number: "+639051697081" })
    // console.log(data)
    // await paypal.authenticate()
    // const id = '7KL33539AA8766240'
    // const captured_payment = await paypal.paymentDetails(id)
    // captured_payment?.purchase_units?.map(unit => {
    //     unit.payments.captures.map(async cp => {
    //         const h = await paypal.refund(cp.id)
    //         console.log(h)
    //     })
    // })
    return NextResponse.json({})
}
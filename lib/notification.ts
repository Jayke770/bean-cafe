import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import Orders from '@/models/orders';
import Cart from '@/models/cart'
export const orderNotification = async (orderId: string): Promise<{ email: string, sms: string }> => {
    let sms_message = "", email_message = ""
    const data = await Orders.findOne({ orderId: { $eq: orderId } }).populate({ path: "items", model: Cart })
    if (data) {
        const delivery_fee = parseFloat(data?.fee ?? "0")
        const total_payment = parseFloat(data.total_payment) + delivery_fee
        sms_message += "Order Summary\n"
        data.items.map((item, i) => {
            sms_message += `${i + 1}: ${item.item_name} ${item?.size ? `(${changeCase.sentenceCase(item.size)})` : ''} - ₱${item.price} ${item.quantity}x\n`
        })
        sms_message += "\n\n"
        sms_message += `ID: ${data.orderId}\n`
        sms_message += `Payment Method: ${changeCase.sentenceCase(data.payment_method)}\n`
        sms_message += `Status: ${changeCase.sentenceCase(data.status)}\n`
        sms_message += `Delivery Fee: ₱${delivery_fee}\n`
        sms_message += `Total Payment: ₱${total_payment.toFixed(2)}\n`
        sms_message += `Date: ${moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}\n\n`
        sms_message += `Check Order Here ${process.env.HOST}/order?id=${data.orderId}`


        email_message += "<b>Order Summary</b></br>"
        data.items.map((item, i) => {
            email_message += `${i + 1}: ${item.item_name} ${item?.size ? `(${changeCase.sentenceCase(item.size)})` : ''} - ₱${item.price} ${item.quantity}x</br>`
        })
        email_message += "</br><hr/>"
        email_message += `<b>ID:</b> ${data.orderId}</br>`
        email_message += `<b>Payment Method:</b> ${changeCase.sentenceCase(data.payment_method)}</br>`
        email_message += `<b>Status:</b> ${changeCase.sentenceCase(data.status)}</br>`
        email_message += `<b>Delivery Fee :</b> ₱${parseFloat(data.total_payment).toFixed(2)}</br>`
        email_message += `<b>Total Payment:</b> ₱${total_payment.toFixed(2)}</br>`
        email_message += `<b>Date:</b> ${moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}</br></br>`
        email_message += `<a href='${process.env.HOST}/order?id=${data.orderId}'>Check Order</a>`

    }
    return { email: email_message, sms: sms_message }
}
export const orderPaid = async (orderId: string): Promise<{ email: string, sms: string }> => {
    let sms_message = "", email_message = ""
    const data = await Orders.findOne({ orderId: { $eq: orderId } }).populate({ path: "items", model: Cart })
    if (data) {
        sms_message += "Order Payment\n\n"
        sms_message += `ID: ${data?.orderId}\n`
        sms_message += `Payment Method: ${changeCase.sentenceCase(data.payment_method)}\n`
        sms_message += `Total Payment: ₱${data.total_payment}`

        email_message += "<b>Order Payment</b></br>"
        email_message += `<b>ID:</b> ${data?.orderId}</br>`
        email_message += `<b>Payment Method:</b> ${changeCase.sentenceCase(data.payment_method)}</br>`
        email_message += `<b>Total Payment:</b> ₱${data.total_payment}`

    }
    return { email: email_message, sms: sms_message }
}
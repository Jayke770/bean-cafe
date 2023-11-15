import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import Orders from '@/models/orders';
import Cart from '@/models/cart'
export const orderNotification = async (orderId: string, message?: string): Promise<{ email: string, sms: string }> => {
    let sms_message = "", email_message = ""
    const data = await Orders.findOne({ orderId: { $eq: orderId } }).populate({ path: "items", model: Cart })
    if (data) {
        const delivery_fee = parseFloat(data?.fee ?? "0")
        const total_payment = parseFloat(data.total_payment) + delivery_fee
        sms_message += "Order Summary%0a%0a"
        data.items.map((item, i) => {
            sms_message += `${i + 1}: ${item.item_name}`
            if (item?.size) {
                sms_message += `(${changeCase.sentenceCase(item.size)})`
            }
            sms_message += ` ₱${item.price} ${item.quantity} x%0a`
        })
        sms_message += `%0aID: ${data.orderId}%0a`
        sms_message += `Payment Method: ${changeCase.sentenceCase(data.payment_method)}%0a`
        sms_message += `Status: ${changeCase.sentenceCase(data.status)}%0a`
        sms_message += `Delivery Fee: ₱${delivery_fee}%0a`
        sms_message += `Total Payment: ₱${total_payment.toFixed(2)}%0a`
        sms_message += `Date: ${moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}%0a%0a`
        sms_message += `Check Order Here ${process.env.HOST}/order?id=${data.orderId}`
        if (message) {
            sms_message += `%0aReason: ${message}`
        }
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
        if (message) {
            email_message += `Reason: ${message}`
        }
    }
    return { email: email_message, sms: sms_message.replaceAll("&", "and") }
}
export const orderPaid = async (orderId: string): Promise<{ email: string, sms: string }> => {
    let sms_message = "", email_message = ""
    const data = await Orders.findOne({ orderId: { $eq: orderId } }).populate({ path: "items", model: Cart })
    if (data) {
        sms_message += "Order Payment%0a%0a"
        sms_message += `ID: ${data?.orderId}%0a`
        sms_message += `Payment Method: ${changeCase.sentenceCase(data.payment_method)}%0a`
        sms_message += `Total Payment: ₱${data.total_payment}`

        email_message += "<b>Order Payment</b></br>"
        email_message += `<b>ID:</b> ${data?.orderId}</br>`
        email_message += `<b>Payment Method:</b> ${changeCase.sentenceCase(data.payment_method)}</br>`
        email_message += `<b>Total Payment:</b> ₱${data.total_payment}`

    }
    return { email: email_message, sms: sms_message }
}
import { Orders } from '@/types'
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import { DELIVERY_FEE } from '@lib/constants'
export const greeting = (): string => {
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning,";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon,";
  } else {
    return "Good Evening,";
  }
};
export const capitalize = (str: string) => str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str
export const orderNotification = (data: Orders, sms?: boolean): string => {
  const delivery_fee = parseFloat(data?.fee ?? "0")
  const total_payment = parseFloat(data.total_payment) + delivery_fee
  let message = ""
  if (sms) {
    message += "Order Summary\n"
    data.items.map((item, i) => {
      message += `${i + 1}: ${item.item_name} ${item?.size ? `(${changeCase.sentenceCase(item.size)})` : ''} - ₱${item.price} ${item.quantity}x\n`
    })
    message += "\n\n"
    message += `ID: ${data.orderId}\n`
    message += `Payment Method: ${changeCase.sentenceCase(data.payment_method)}\n`
    message += `Status: ${changeCase.sentenceCase(data.status)}\n`
    message += `Delivery Fee: ₱${delivery_fee}\n`
    message += `Total Payment: ₱${total_payment.toFixed(2)}\n`
    message += `Date: ${moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}\n\n`
    message += `Check Order Here ${process.env.HOST}/order?id=${data.orderId}`
  } else {
    message += "<b>Order Summary</b></br>"
    data.items.map((item, i) => {
      message += `${i + 1}: ${item.item_name} ${item?.size ? `(${changeCase.sentenceCase(item.size)})` : ''} - ₱${item.price} ${item.quantity}x</br>`
    })
    message += "</br><hr/>"
    message += `<b>ID:</b> ${data.orderId}</br>`
    message += `<b>Payment Method:</b> ${changeCase.sentenceCase(data.payment_method)}</br>`
    message += `<b>Status:</b> ${changeCase.sentenceCase(data.status)}</br>`
    message += `<b>Delivery Fee :</b> ₱${parseFloat(data.total_payment).toFixed(2)}</br>`
    message += `<b>Total Payment:</b> ₱${total_payment.toFixed(2)}</br>`
    message += `<b>Date:</b> ${moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}</br></br>`
    message += `<a href='${process.env.HOST}/order?id=${data.orderId}'>Check Order</a>`
  }
  return message
}
export const orderPaid = (data: Orders, sms?: boolean) => {
  let message = ""
  if (sms) {
    message += "Order Payment\n\n"
    message += `ID: ${data?.orderId}\n`
    message += `Payment Method: ${changeCase.sentenceCase(data.payment_method)}\n`
    message += `Total Payment: ₱${data.total_payment}`
  } else {
    message += "<b>Order Payment</b></br>"
    message += `<b>ID:</b> ${data?.orderId}</br>`
    message += `<b>Payment Method:</b> ${changeCase.sentenceCase(data.payment_method)}</br>`
    message += `<b>Total Payment:</b> ₱${data.total_payment}`
  }
  return message
}
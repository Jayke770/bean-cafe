import { Orders } from '@/types'
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
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
export const orderNotification = (data: Orders): string => {
  let message = "<b>Order Summary</b></br>"
  data.items.map((item, i) => {
    message += `${i + 1}: ${item.item_name} - ₱${item.price} ${item.quantity}x</br>`
  })
  message += "</br><hr/>"
  message += `<b>Payment Method:</b> ${changeCase.sentenceCase(data.payment_method)}</br>`
  message += `<b>Status:</b> ${changeCase.sentenceCase(data.status)}</br>`
  message += `<b>Total Payment:</b> ₱${parseFloat(data.total_payment).toFixed(2)}</br>`
  message += `<b>Date:</b> ${moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}`
  return message
}
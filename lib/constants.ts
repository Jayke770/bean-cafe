export const SIZES = ["Small", "Medium", "Large", "Extra Large"];
export const CATEGORIES = ["Coffee", "Milk Tea", "Burger", "Cakes"];
export const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]
export const ORDER_STATUS: {
    [key: string]: {
        title: string,
        description: string,
        showLoader?: boolean,
        showXMark?: boolean,
        showCheckMark?: boolean
    }
} = {
    order_placed: {
        title: "Order Placed",
        description: "You have successfully placed your order.",
        showCheckMark: true
    },
    payment: {
        title: "Payment",
        description: "Order successfully paid.",
        showCheckMark: true
    },
    waiting_payment: {
        title: "Waiting for Payment",
        description: "",
        showLoader: true
    },
    disapprove: {
        title: "Order disapproved",
        description: "Your was order disapproved.",
        showXMark: true
    },
    waiting_for_refund: {
        title: "Waiting for refund",
        description: "Refund is pending.",
        showLoader: true
    },
    order_approve: {
        title: "Order Approved",
        description: "Order successfully approved.",
        showCheckMark: true
    },
    waiting_for_approval: {
        title: "Waiting for approval.",
        description: "",
        showLoader: true
    },
    processing: {
        title: "Processing Order",
        description: "Order is being processed.",
        showLoader: true
    },
    out_for_delivery: {
        title: "Out for Delivery",
        description: "Order is out for delivery.",
        showLoader: true
    },
    delivered: {
        title: "Order Delivered",
        description: "Order successfully delivered.",
        showCheckMark: true
    }
}
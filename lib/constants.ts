export const SIZES = ["Small", "Medium", "Large", "Extra Large"];
export const CATEGORIES = ["Coffee", "Milk Tea", "Burger", "Cakes"];
export const REPORT_TYPES = ["daily", "monthly", "yearly"]
export const DELIVERY_FEE = 50
export const ITEM_LIMIT_FOR_ORDER = 3
export const COD_MESSAGE = "Cash on Delivery is only available within Maranding on orders with a total value of ₱200 or more."
export const CURRENCY = "₱"
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
    refunded: {
        title: "Refunded",
        description: "Payment Successfully refunded.",
        showCheckMark: true
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
    },
    cancelled: {
        title: "Order Cancelled",
        description: "Your order was cancelled.",
        showXMark: true
    }
}
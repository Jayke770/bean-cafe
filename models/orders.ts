import { Orders as ord } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Orders = new Schema<ord>({
    orderId: { type: String },
    items: [],
    message: { type: String },
    created: { type: Number },
    payment_method: { type: String },
    status: { type: String },
    userID: { type: String },
    total_payment: { type: String },
    payment_id: { type: String },
    name: { type: String },
    address: { type: String },
    gcash_image: { type: String },
    isApproved: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    isRefunded: { type: Boolean, default: false },
}, { timestamps: true });
if (models["orders"] != null) {
    deleteModel("orders");
}
export default model("orders", Orders);

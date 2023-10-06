import { UserCart } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Cart = new Schema<UserCart>({
    category: { type: String },
    created: { type: Number },
    user_id: { type: Schema.Types.ObjectId },
    cart_id: { type: String },
    item_id: { type: String },
    item_name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    size: { type: String },
    status: { type: String, default: "not-ordered" }
}, { timestamps: true });
if (models["cart"] != null) {
    deleteModel("cart");
}
export default model("cart", Cart);

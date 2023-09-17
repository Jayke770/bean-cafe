import { UserModel } from "@/types";
import moment from "moment-timezone";
import { Schema, models, deleteModel, model } from "mongoose";
const Users = new Schema<UserModel>({
  address: { type: String, default: undefined },
  created: { type: Number, default: parseFloat(moment().format("x")) },
  email: { type: String },
  emailVerified: { type: Boolean },
  image: { type: String },
  name: { type: String },
  paypal_email: { type: String },
  phone_number: { type: String },
  role: { type: String, default: "user" },
  status: { type: String, default: "new" },
  orders: [],
  cart: []
});
if (models["users"] != null) {
  deleteModel("users");
}
export default model("users", Users);

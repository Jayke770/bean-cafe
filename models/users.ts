import type { UserModel } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Users = new Schema<UserModel>({
  address: { type: String, default: undefined },
  created: { type: Number },
  email: { type: String },
  emailVerified: { type: Boolean },
  image: { type: String },
  name: { type: String },
  paypal_email: { type: String },
  phone_number: { type: String },
  orders: [],
});
if (models["users"] != null) {
  deleteModel("users");
}
export default model("users", Users);

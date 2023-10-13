import { Items } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Items = new Schema<Items>({
  item_id: { type: String },
  description: { type: String },
  image: { type: String },
  name: { type: String },
  category: { type: String },
  created: { type: Number },
  sizes: [],
  addons: [],
  price: { type: Number },
  sold: { type: Number, default: 0 },
  stocks: { type: Number },
}, { timestamps: true });
if (models["items"] != null) {
  deleteModel("items");
}
export default model("items", Items);

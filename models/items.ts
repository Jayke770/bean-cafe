import { Items } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Items = new Schema<Items>({
  description: { type: String },
  image: { type: String },
  name: { type: String },
  price: { type: Number },
  created: { type: Number },
  sizes: [],
  addons: [],
});
if (models["items"] != null) {
  deleteModel("items");
}
export default model("items", Items);

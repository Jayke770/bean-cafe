import { AddOns } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Addons = new Schema<AddOns>({
  category: { type: String },
  image: { type: String },
  created: { type: Number },
  name: { type: String },
  options: [],
});
if (models["addons"] != null) {
  deleteModel("addons");
}
export default model("addons", Addons);

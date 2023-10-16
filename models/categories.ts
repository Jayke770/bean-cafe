import { CategoriesType } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const Categories = new Schema<CategoriesType>({
    type: { type: String },
    created: { type: Number },
}, { timestamps: true });
if (models["categories"] != null) {
    deleteModel("categories");
}
export default model("categories", Categories);

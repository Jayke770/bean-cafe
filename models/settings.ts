import { settings } from "@/types";
import { Schema, models, deleteModel, model } from "mongoose";
const settings = new Schema<settings>({
    codMessage: { type: String },
    currency: { type: String }
}, { timestamps: true });
if (models["settings"] != null) {
    deleteModel("settings");
}
export default model("settings", settings);

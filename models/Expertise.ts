import { Schema, model, models } from "mongoose";

const ExpertiseSchema = new Schema({
  value: { type: String, unique: true, required: true },
  label: { type: String, required: true },
  archived: { type: Boolean, default: false },
});

export default models.Expertise || model("Expertise", ExpertiseSchema);

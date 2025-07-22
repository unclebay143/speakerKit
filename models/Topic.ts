import { Schema, model, models } from "mongoose";

const TopicSchema = new Schema({
  value: { type: String, unique: true, required: true },
  label: { type: String, required: true },
  archived: { type: Boolean, default: false },
});

export default models.Topic || model("Topic", TopicSchema);

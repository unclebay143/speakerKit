import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [
        /^[a-z0-9-]{3,30}$/,
        "Username must be 3-30 characters with only letters, numbers, and hyphens",
      ],
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "/placeholder.svg",
    },
    socialMedia: {
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      email: { type: String, default: '' }
    },
    location: { 
      type: String, 
      default: "" 
    },
    website: { 
      type: String, 
      default: "" 
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;

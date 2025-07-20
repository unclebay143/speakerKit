import { generateRandomSlug } from "@/utils/generateSlug";
import { Schema, model, models } from "mongoose";

const ALLOWED_PLAN = ["free", "pro", "lifetime"];

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
    slug: {
      type: String,
      unique: true,
      required: true,
      default: generateRandomSlug,
    },
    // username: {
    //   type: String,
    //   trim: true,
    //   lowercase: true,
    //   sparse: true,
    //   match: [
    //     /^[a-z0-9-]{3,30}$/,
    //     "Username must be 3-30 characters with only letters, numbers, and hyphens",
    //   ],
    // },
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
    theme: {
      type: String,
      enum: ["light", "dark", "blue", "purple", "teal", "green", "gradient"],
      default: "teal",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    socialMedia: {
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    tools: {
      type: [String],
      enum: ["notion", "canva", "google-docs", "figma", "powerpoint"],
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ALLOWED_PLAN,
      default: "free",
    },
    planLimits: {
      profiles: { type: Number, default: 1 },
      folders: { type: Number, default: 1 },
      imagesPerFolder: { type: Number, default: 3 },
    },
    planExpiresAt: { type: Date, default: null },
    paystackCustomerId: {
      type: String,
      default: null,
    },
    paystackSubscriptionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("plan")) {
    if (this.plan === "free") {
      this.planLimits = {
        profiles: 1,
        folders: 1,
        imagesPerFolder: 3,
      };
    } else if (this.plan === "pro" || this.plan === "lifetime") {
      this.planLimits = {
        profiles: Infinity,
        folders: Infinity,
        imagesPerFolder: Infinity,
      };
    }
  }
  next();
});

const User = models.User || model("User", UserSchema);

export default User;

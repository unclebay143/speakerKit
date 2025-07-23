import { generateRandomSlug } from "@/utils/generateSlug";
import { Schema, model, models } from "mongoose";

const ALLOWED_PLAN = ["free", "pro", "lifetime"];

const UserSchema = new Schema(
  {
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
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
    hasPassword: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      default: generateRandomSlug,
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
      website: { type: String, default: "" },
    },
    tools: {
      type: [String],
      enum: ["notion", "canva", "google-docs", "figma", "powerpoint"],
    },
    expertise: {
      type: [String],
      default: [],
    },
    topics: {
      type: [String],
      default: [],
    },
    location: {
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
      events: { type: Number, default: 2 },
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
        events: 2,
      };
    } else if (this.plan === "pro" || this.plan === "lifetime") {
      this.planLimits = {
        profiles: Infinity,
        folders: Infinity,
        imagesPerFolder: Infinity,
        events: Infinity,
      };
    }
  }
  next();
});

const User = models.User || model("User", UserSchema);

export default User;

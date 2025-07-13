import { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shortBio: String,
    mediumBio: String,
    longBio: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = models.Profile || model("Profile", ProfileSchema);

export default Profile;

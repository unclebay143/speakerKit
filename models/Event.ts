import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
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
    event: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Conference",
        "Meetup",
        "Workshop",
        "Podcast",
        "Interview",
        "Product Demo",
        "Webinar",
        "Panel Discussion",
        "Keynote",
        "Tutorial",
        "Playlist",
      ],
    },
    coverImage: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    youtubeVideo: {
      type: String,
      default: "",
    },
    youtubePlaylist: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on userId for faster queries
EventSchema.index({ userId: 1 });

const Event = models.Event || model("Event", EventSchema);

export default Event;

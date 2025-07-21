import { isYouTubeUrl } from "@/lib/youtube-utils";
import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    event: z.string().min(1, "Event name is required"),
    date: z.string().min(1, "Event date is required"),
    location: z.string().min(1, "Event location is required"),
    type: z.string().min(1, "Event type is required"),
    link: z.string().optional(),
    youtubeVideo: z.string().optional(),
    youtubePlaylist: z.string().optional(),
    coverImage: z.any().optional(), // File or string
  })
  .refine(
    (data) => {
      // Ensure at least one of: coverImage, youtubeVideo, or youtubePlaylist is provided
      const hasImage =
        data.coverImage &&
        (typeof data.coverImage === "string"
          ? data.coverImage.trim() !== ""
          : data.coverImage instanceof File);
      const hasYouTubeVideo =
        data.youtubeVideo &&
        data.youtubeVideo.trim() !== "" &&
        isYouTubeUrl(data.youtubeVideo);
      const hasYouTubePlaylist =
        data.youtubePlaylist &&
        data.youtubePlaylist.trim() !== "" &&
        isYouTubeUrl(data.youtubePlaylist);

      return hasImage || hasYouTubeVideo || hasYouTubePlaylist;
    },
    {
      message:
        "Please provide either a cover image or a valid YouTube video/playlist link",
      path: ["coverImage"], // This will show the error on the coverImage field
    }
  );

export type EventFormData = z.infer<typeof eventSchema>;

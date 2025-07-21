import { uploadToCloudinary } from "@/lib/cloudinary-utils";
import connectViaMongoose from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectViaMongoose();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch events for this user
    const events = await Event.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectViaMongoose();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const event = formData.get("event") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const link = formData.get("link") as string;
    const youtubeVideo = formData.get("youtubeVideo") as string;
    const youtubePlaylist = formData.get("youtubePlaylist") as string;
    const coverImageFile = formData.get("coverImage") as File | null;
    const coverImageUrl = formData.get("coverImage") as string | null;

    if (!title || !event || !date || !location || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let finalCoverImageUrl = "";

    // Handle image upload if provided as a file
    if (coverImageFile && coverImageFile.size > 0) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(coverImageFile.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, and WebP images are allowed" },
          { status: 400 }
        );
      }

      // Validate file size
      if (coverImageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File size exceeds the limit of ${
              MAX_FILE_SIZE / 1024 / 1024
            }MB`,
          },
          { status: 400 }
        );
      }

      try {
        const result = await uploadToCloudinary(coverImageFile, {
          folder: "event-covers",
          publicId: `event-${user._id}-${Date.now()}`,
          overwrite: true,
        });
        finalCoverImageUrl = result.secure_url;
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    } else if (
      coverImageUrl &&
      coverImageUrl.trim() &&
      coverImageUrl !== "https://via.placeholder.com/400x300?text=Event+Image"
    ) {
      // Use existing image URL (but not placeholder)
      finalCoverImageUrl = coverImageUrl;
    } else {
      // Use placeholder if no image is provided or if it's the placeholder
      finalCoverImageUrl =
        "https://via.placeholder.com/400x300?text=Event+Image";
    }

    // Create new event
    const newEvent = new Event({
      userId: user._id,
      title,
      event,
      date,
      location,
      type,
      coverImage: finalCoverImageUrl,
      link: link || "",
      youtubeVideo: youtubeVideo || "",
      youtubePlaylist: youtubePlaylist || "",
    });

    await newEvent.save();

    return NextResponse.json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

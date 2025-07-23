import { uploadToCloudinary } from "@/lib/cloudinary-utils";
import connectViaMongoose from "@/lib/db";
import {
  ALLOWED_FILE_TYPES,
  formatMaxFileSize,
  MAX_FILE_SIZE,
} from "@/lib/file-constants";
import Event from "@/models/Event";
import User from "@/models/User";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Accept FormData for updates
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

    // Find and update the event
    const eventDoc = await Event.findOne({ _id: params.id, userId: user._id });
    if (!eventDoc) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let finalCoverImageUrl = "";
    // Handle image upload if provided as a file
    if (
      coverImageFile &&
      typeof coverImageFile !== "string" &&
      coverImageFile.size > 0
    ) {
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
            error: `File size exceeds the limit of ${formatMaxFileSize(
              MAX_FILE_SIZE
            )}`,
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
      typeof coverImageUrl === "string" &&
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

    // Update event fields
    eventDoc.title = title;
    eventDoc.event = event;
    eventDoc.date = date;
    eventDoc.location = location;
    eventDoc.type = type;
    eventDoc.coverImage = finalCoverImageUrl;
    eventDoc.link = link || "";
    eventDoc.youtubeVideo = youtubeVideo || "";
    eventDoc.youtubePlaylist = youtubePlaylist || "";

    await eventDoc.save();

    return NextResponse.json({
      message: "Event updated successfully",
      event: eventDoc,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find and delete the event
    const event = await Event.findOneAndDelete({
      _id: params.id,
      userId: user._id,
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

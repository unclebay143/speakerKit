import connectViaMongoose from "@/lib/db";
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

    const eventData = await request.json();

    if (
      !eventData.title ||
      !eventData.event ||
      !eventData.date ||
      !eventData.location ||
      !eventData.type
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectViaMongoose();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find and update the event
    const event = await Event.findOne({ _id: params.id, userId: user._id });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update event fields
    event.title = eventData.title;
    event.event = eventData.event;
    event.date = eventData.date;
    event.location = eventData.location;
    event.type = eventData.type;
    event.coverImage = eventData.coverImage || "";
    event.link = eventData.link || "";
    event.youtubeVideo = eventData.youtubeVideo || "";
    event.youtubePlaylist = eventData.youtubePlaylist || "";

    await event.save();

    return NextResponse.json({
      message: "Event updated successfully",
      event,
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

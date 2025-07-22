import connectViaMongoose from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectViaMongoose();

    const user = await User.findOne({ slug: params.slug });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch events for this user with pagination
    const events = await Event.find({
      userId: user._id,
      isPublic: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination info
    const totalEvents = await Event.countDocuments({
      userId: user._id,
      isPublic: true,
    });

    const totalPages = Math.ceil(totalEvents / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        totalEvents,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

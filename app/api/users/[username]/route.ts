import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectViaMongoose();

    const user = await User.findOne({ username: params.username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      image: user.image,
      location: user.location,
      email: user.email,
      createdAt: user.createdAt,
      website: user.website,
      country: user.country,
      theme: user.theme,
      isVerified: user.isVerified,
      socialMedia: user.socialMedia,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

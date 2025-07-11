import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectViaMongoose();
    
    const user = await User.findOne({ username: params.username });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      image: user.image,
      location: user.location,
      email: user.email,
      joinedDate: user.createdAt,
      website: user.website,
      country: user.country
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
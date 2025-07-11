import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import Profile from "@/models/Profile";

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

    const profiles = await Profile.find({ userId: user._id, isPublic: true });
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
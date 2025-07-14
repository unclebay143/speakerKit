import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Profile from "@/models/Profile";
import connectViaMongoose from "@/lib/db";
import { authOptions } from "@/utils/auth-options";

export async function GET() {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profiles = await Profile.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestData = await req.json();
    const { title, shortBio, mediumBio, longBio, isPublic } = requestData;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newProfile = new Profile({
      userId: session.user.id,
      title,
      shortBio,
      mediumBio,
      longBio,
      isPublic: isPublic !== false 
    });

    await newProfile.save();

    return NextResponse.json({ 
      success: true,
      profile: newProfile
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
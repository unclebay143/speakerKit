import { NextResponse } from "next/server";
import User from "@/models/User";
import connectViaMongoose from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username } = await req.json();

     if (!username || !/^[a-z0-9-]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters with only letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

     const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.email !== session.user.email) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        username,
        hasCompletedOnboarding: true 
      },
      { new: true, returnOriginal: false  }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      username: user.username,
       user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
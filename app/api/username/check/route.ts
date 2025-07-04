import { NextResponse } from "next/server";
import User from "@/models/User";
import connectViaMongoose from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const { username } = await req.json();

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username });
    return NextResponse.json({ 
      available: !existingUser,
      suggested: existingUser ? `${username}-${Math.floor(Math.random() * 1000)}` : null
    });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
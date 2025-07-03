import { NextResponse } from "next/server";
import User from "@/models/User";
import connectViaMongoose from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();

    const requestData = await req.json();
    console.log("Request data:", requestData);

      const { name, email, password } = requestData;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 401 }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return NextResponse.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error || "Internal server error" },
      { status: 500 }
    );
  }
}
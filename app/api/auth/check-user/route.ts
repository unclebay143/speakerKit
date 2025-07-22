import { NextResponse } from 'next/server';
import connectViaMongoose from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('authProvider');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authProvider: user.authProvider || "credentials"
    });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import connectViaMongoose from "@/lib/db";
import SubscriptionDiscount from "@/models/SubscriptionDiscount";
import User from "@/models/User";
import { generateRandomSlug } from "@/utils/generateSlug";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();

    const requestData = await req.json();

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

    const discount = await SubscriptionDiscount.findOne({
      email: email.toLowerCase(),
      usedAt: { $exists: false },
    });

    let userSlug;
    let isUnique = false;
    while (!isUnique) {
      userSlug = generateRandomSlug();
      const exists = await User.findOne({ slug: userSlug });
      if (!exists) isUnique = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      slug: userSlug,
      plan: discount ? "pro" : "free",
      planExpiresAt: discount
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : null,
      hasCompletedOnboarding: false,
      socialMedia: {
        twitter: "",
        linkedin: "",
        instagram: "",
        email: email,
        website: "",
      },
      location: "",
    });
    await user.save();

    if (discount) {
      await SubscriptionDiscount.findByIdAndUpdate(discount._id, {
        usedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        website: user.website,
        location: user.location,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        socialMedia: user.socialMedia,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error || "Internal server error" },
      { status: 500 }
    );
  }
}

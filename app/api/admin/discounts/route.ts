import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import SubscriptionDiscount from "@/models/SubscriptionDiscount";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const { email } = await req.json();

    const existing = await SubscriptionDiscount.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists in discount list" },
        { status: 400 }
      );
    }

    const discount = await SubscriptionDiscount.create({ email });
    return NextResponse.json({ success: true, discount });
  } catch (error) {
    console.error("Error adding discount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectViaMongoose();
    const discounts = await SubscriptionDiscount.find().sort({ createdAt: -1 });
    return NextResponse.json(discounts);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
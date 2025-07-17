import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.plan || "Free",
      price: user.plan === "pro" ? "₦48,000/yr" : user.plan === "lifetime" ? "₦100,000" : "₦0",
      status: "Active",
      renewal: user.plan === "pro" ? 
        user.planExpiresAt?.toISOString().split('T')[0] : 
        "Never"
    });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectViaMongoose();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).select(
    "-password -__v"
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user,
  });
}

export async function PUT(req: Request) {
  await connectViaMongoose();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updateFields = await req.json();
  // Only allow updating certain fields
  const allowedFields = ["name", "username", "image", "theme", "isPublic"];
  const updateData: Record<string, any> = {};
  for (const key of allowedFields) {
    if (key in updateFields) {
      updateData[key] = updateFields[key];
    }
  }

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    updateData,
    { new: true }
  ).select("-password -__v");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user,
  });
}

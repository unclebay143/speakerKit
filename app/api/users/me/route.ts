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
      // Handle image field validation
      if (key === "image") {
        const imageValue = updateFields[key];
        if (typeof imageValue === "string") {
          updateData[key] = imageValue;
        } else if (imageValue && typeof imageValue === "object") {
          // If it's an object, try to extract URL or ignore it
          if (imageValue.url && typeof imageValue.url === "string") {
            updateData[key] = imageValue.url;
          }
          // If it's an empty object or doesn't have a url, skip it
        }
      } else {
        updateData[key] = updateFields[key];
      }
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

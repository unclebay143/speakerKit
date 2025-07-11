import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import Folder from "@/models/Folders";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectViaMongoose();
    
    const user = await User.findOne({ username: params.username });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const folders = await Folder.find({ userId: user._id }).populate("images");
    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
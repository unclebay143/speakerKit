import mongoose from "mongoose"; 
import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import Folder from "@/models/Folders";
import Image from "@/models/Images";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectViaMongoose();

    if (!mongoose.models.Image) {
      throw new Error("Image model not registered");
    }
    
    const user = await User.findOne({ slug: params.slug });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const allImages = await mongoose.model("Image").find({});
    console.log("All Images in DB:", allImages.length);

    const folders = await Folder.find({ userId: user._id })
    .populate("images");

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
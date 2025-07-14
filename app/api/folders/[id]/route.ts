import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";
import mongoose from 'mongoose';

import connectViaMongoose from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import Folder from "@/models/Folders";
import Image from "@/models/Images";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  req: Request
) {
  try {
    await connectViaMongoose();

    const url = new URL(req.url);
     const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

     if (!id || id === "[object%20Object]" || id === "[object Object]") {
      return NextResponse.json(
        { error: "Invalid folder ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid folder ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const folder = await Folder.findOne({
       _id: id,
      userId: session.user.id,
    }).populate("images");
    
    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request
) {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);
    const { name } = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name },
      { new: true }
    );
    
    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request
) {
  try {
    await connectViaMongoose();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const folder = await Folder.findOne({
      _id: id,
      userId: session.user.id,
    }).populate('images');
    
    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

     if (folder.images && folder.images.length > 0) {
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        folder.images.map(async (image: any) => {
          try {
            await cloudinary.uploader.destroy(image.publicId);
            await Image.deleteOne({ _id: image._id });
          } catch (error) {
            console.error(`Error deleting image ${image._id}:`, error);
          }
        })
      );
    }

    await Folder.deleteOne({ _id: id });
    return NextResponse.json(
      { message: "Folder deleted successfully" }
    );
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
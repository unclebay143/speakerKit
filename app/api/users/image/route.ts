import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/lib/cloudinary-utils";
import connectViaMongoose from "@/lib/db";
import { CLOUDINARY_FOLDER } from "@/lib/utils";
import User from "@/models/User";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const result = await uploadToCloudinary(image, {
      folder: CLOUDINARY_FOLDER,
      publicId: `user-${session.user.email}-${Date.now()}`,
      overwrite: true,
    });

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { image: result.secure_url },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      image: updatedUser?.image,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user || !user.image) {
      return NextResponse.json(
        { error: "No image to delete" },
        { status: 400 }
      );
    }

    const publicIdMatch = user.image.match(/\/v\d+\/([^\.]+)\./);
    const publicId = publicIdMatch
      ? `profile-images/${publicIdMatch[1]}`
      : null;

    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    await user.save();

    return NextResponse.json({ success: true, image: user.image });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

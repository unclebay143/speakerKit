import cloudinary from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const image = await Image.findOne({
      _id: id,
      userId: session.user.id,
    });
    
    if (!image) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    await cloudinary.uploader.destroy(image.publicId);

     await Folder.updateOne(
      { _id: image.folderId },
      { $pull: { images: image._id } }
    );

    await Image.deleteOne({ _id: id });
    return NextResponse.json(
      { message: "Image deleted successfully" }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
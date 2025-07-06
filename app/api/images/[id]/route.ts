// import cloudinary from "@/lib/cloudinary";
import connectViaMongoose from "@/lib/db";
import Image from "@/models/Images";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


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

    // for (const imageId of folder.images) {
    //   const image = await Image.findById(imageId);
    //   if (image) {
    //     await cloudinary.uploader.destroy(image.publicId);
    //     await Image.deleteOne({ _id: imageId });
    //   }
    // }

    await Image.deleteOne({ _id: id });
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
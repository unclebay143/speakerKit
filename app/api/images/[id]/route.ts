import { deleteFromCloudinary } from "@/lib/cloudinary-utils";
import connectViaMongoose from "@/lib/db";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectViaMongoose();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const image = await Image.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await deleteFromCloudinary(image.publicId);

    await Folder.updateOne(
      { _id: image.folderId },
      { $pull: { images: image._id } }
    );

    await Image.deleteOne({ _id: id });
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import connectViaMongoose from "@/lib/db";
import { checkPlanLimits } from "@/middleware/planLimits";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
import User from "@/models/User";
import { authOptions } from "@/utils/auth-options";
import { v2 as cloudinary } from "cloudinary";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { join } from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitCheck = await checkPlanLimits({
      userId: session.user.id,
      resourceType: "image",
    });

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.error || "Image creation not allowed",
          limitReached: true,
          current: limitCheck.current,
          limit: limitCheck.limit,
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const folderId = formData.get("folderId") as string;
    const file = formData.get("file") as File;

    if (!folderId || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`,
        },
        { status: 400 }
      );
    }

    const folder = await Folder.findOne({
      _id: folderId,
      userId: session.user.id,
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join("/tmp", file.name);
    await writeFile(path, buffer);

    const result = await cloudinary.uploader.upload(path, {
      folder: `user_uploads/${session.user.id}/${folderId}`,
      allowed_formats: ["jpg", "png", "webp"],
      format: "auto",
    });

    const image = await Image.create({
      name: file.name,
      url: result.secure_url,
      publicId: result.public_id,
      folderId: folder._id,
      userId: session.user.id,
      size: result.bytes,
      width: result.width,
      height: result.height,
      format: result.format,
    });

    folder.images.push(image._id);
    await folder.save();

    const user = await User.findById(session.user.id);
    if (user && (!user.image || user.image === "/placeholder.svg")) {
      user.image = image.url;
      await user.save();
    }
    return NextResponse.json(image, { status: 201 });

    //  if (!session.user.image) {
    // const user = await User.findByIdAndUpdate(
    //   session.user.id,
    //   { image: image.url },
    //   { new: true }
    // );

    // return NextResponse.json({
    //   image: image,
    //   updatedProfileImage: user?.image
    // }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}

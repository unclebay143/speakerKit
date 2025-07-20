import connectViaMongoose from "@/lib/db";
import { CLOUDINARY_FOLDER } from "@/lib/utils";
import { checkPlanLimits } from "@/middleware/planLimits";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
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

    const formData = await req.formData();
    const folderId = formData.get("folderId") as string;
    const files = formData.getAll("file") as File[];

    if (!folderId || files.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.name}` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB): ${
              file.name
            }`,
          },
          { status: 400 }
        );
      }
    }

    const folder = await Folder.findOne({
      _id: folderId,
      userId: session.user.id,
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    let currentImageCount = folder.images.length;

    if (session.user.plan === "free" && currentImageCount + files.length > 3) {
      return NextResponse.json(
        {
          error: "Free plan limited to 3 images per folder",
          limitReached: true,
          current: currentImageCount,
          limit: 3,
        },
        { status: 403 }
      );
    }

    const limitCheck = await checkPlanLimits({
      userId: session.user.id,
      resourceType: "image",
      folderId: folderId,
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

    const uploadedImages = [];

    for (const file of files) {
      if (session.user.plan === "free" && currentImageCount >= 3) {
        return NextResponse.json(
          {
            error: "Free plan limited to 3 images per folder",
            limitReached: true,
            current: currentImageCount,
            limit: 3,
          },
          { status: 403 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const path = join("/tmp", file.name);
      await writeFile(path, buffer);

      const result = await cloudinary.uploader.upload(path, {
        folder: CLOUDINARY_FOLDER,
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

      uploadedImages.push(image);
      folder.images.push(image._id);
      currentImageCount++;
    }

    await folder.save();

    return NextResponse.json(uploadedImages, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}

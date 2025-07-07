import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import connectViaMongoose from "@/lib/db";
import { authOptions } from "@/utils/auth-options";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function PUT(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const buffer = await image.arrayBuffer();
    const bytes = Buffer.from(buffer);
   
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-images',
          public_id: `user-${session.user.email}-${Date.now()}`,
          overwrite: true
        },
        (error, result) => {
          if (error) return reject(error);
           resolve(result as UploadApiResponse);
        }
      );
       uploadStream.end(bytes);
    });

     const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { image: result.secure_url },
      { new: true }
    );

    return NextResponse.json({ 
      success: true,
      image: updatedUser?.image
    });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
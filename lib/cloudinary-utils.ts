import type { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  overwrite?: boolean;
  allowedFormats?: string[];
  format?: string;
}

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<UploadApiResponse> {
  const {
    folder = "uploads",
    publicId,
    overwrite = false,
    allowedFormats = ["jpg", "png", "webp"],
    format = "auto",
  } = options;

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite,
        allowed_formats: allowedFormats,
        format,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

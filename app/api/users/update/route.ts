import connectViaMongoose from "@/lib/db";
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

    const { name, username, image, isPublic, socialMedia, location, website } = await req.json();

    const updateData: Partial<{
      name: string;
      username: string;
      image: string;
      isPublic: boolean;
      location: string;
      website: string;
      socialMedia: {
        twitter: string;
        linkedin: string;
        instagram: string;
        email: string;
      };
    }> = {};

    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (image) updateData.image = image;
    if (location) updateData.location = location;
    if (website) updateData.website = website;
    if (typeof isPublic !== "undefined") updateData.isPublic = isPublic;
    if (socialMedia) {
      updateData.socialMedia = {
        twitter: socialMedia.twitter || '',
        linkedin: socialMedia.linkedin || '',
        instagram: socialMedia.instagram || '',
        email: socialMedia.email || session.user.email
      };
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        image: updatedUser.image,
        isPublic: updatedUser.isPublic,
        location: updatedUser.location,
        website: updatedUser.website,
        socialMedia: updatedUser.socialMedia
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Profile from "@/models/Profile";
import connectViaMongoose from "@/lib/db";
import { authOptions } from "@/utils/auth-options";

export async function PUT(req: Request) {
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

    const requestData = await req.json();
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      requestData,
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    
    const deletedProfile = await Profile.findOneAndDelete({
      _id: id,
      userId: session.user.id
    });

    if (!deletedProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
import User from "@/models/User";
import connectViaMongoose from "@/lib/db";
import Folder from "@/models/Folders";
import Profile from "@/models/Profile";
import Image from "@/models/Images";

interface CheckPlanLimitsParams {
  userId: string;
  resourceType: "profile" | "folder" | "image";
  folderId?: string;
}

export async function checkPlanLimits(params: CheckPlanLimitsParams) {
  const { userId, resourceType, folderId } = params;
  
  try {
    await connectViaMongoose();
    const user = await User.findById(userId);
    
    if (!user) {
      return { allowed: false, error: "User not found" };
    }

    // Pro and lifetime users have no limits
    if (user.plan === "pro" || user.plan === "lifetime") {
      return { allowed: true };
    }

    // Free plan checks
    if (resourceType === "profile") {
      const profileCount = await Profile.countDocuments({ userId });
      if (profileCount >= 1) { 
        return { 
          allowed: false, 
          error: "Profile limit reached",
          limit: 1,
          current: profileCount
        };
      }
    }

    if (resourceType === "folder") {
      const folderCount = await Folder.countDocuments({ userId });
      if (folderCount >= 1) {
        return { 
          allowed: false, 
          error: "Folder limit reached",
          limit: 1,
          current: folderCount
        };
      }
    }

    if (resourceType === "image") {
    //   if (!folderId) {
    //     return { 
    //       allowed: false, 
    //       error: "Folder ID is required for image limit check"
    //     };
    //   }

     if (!folderId) {
        return { allowed: true };
      }
      
      const imageCount = await Image.countDocuments({ folderId, userId });
      if (imageCount >= 3) { 
        return { 
          allowed: false, 
          error: "Image limit reached",
          limit: 3,
          current: imageCount
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking plan limits:", error);
    return { allowed: false, error: "Internal server error" };
  }
}
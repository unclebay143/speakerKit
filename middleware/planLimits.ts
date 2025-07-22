// import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import Event from "@/models/Event";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
import Profile from "@/models/Profile";
import User from "@/models/User";

interface CheckPlanLimitsParams {
  userId: string;
  resourceType: "profile" | "folder" | "image" | "event";
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

    if (
      user.plan === "pro" &&
      user.planExpiresAt &&
      new Date() > user.planExpiresAt
    ) {
      await User.findByIdAndUpdate(userId, { plan: "free" });
      return {
        allowed: false,
        error: "Your Pro plan has expired. Please renew.",
        limit: 0,
        current: 0,
      };
    }

    // Pro and lifetime users have no limits
    if (user.plan === "pro" || user.plan === "lifetime") {
      return { allowed: true };
    }

    switch (resourceType) {
      case "profile":
        const profileCount = await Profile.countDocuments({ userId });
        return {
          allowed: profileCount < 1,
          error:
            "Free plan limited to 1 profile. Upgrade to Pro for unlimited profiles.",
          limit: 1,
          current: profileCount,
        };

      case "folder":
        const folderCount = await Folder.countDocuments({ userId });
        return {
          allowed: folderCount < 1,
          error:
            "Free plan limited to 2 folders. Upgrade to Pro for unlimited folders.",
          limit: 1,
          current: folderCount,
        };

      case "image":
        if (folderId) {
          const imageCount = await Image.countDocuments({ folderId, userId });
          return {
            allowed: imageCount < 3,
            error:
              "Free plan limited to 3 images per folder. Upgrade to Pro for unlimited images.",
            limit: 3,
            current: imageCount,
          };
        }
         case "event":
          const eventCount = await Event.countDocuments({ userId });
          return {
            allowed: eventCount < 2,
            error: "Free plan limited to 2 events. Upgrade to Pro for unlimited events.",
            limit: 2,
            current: eventCount,
          };
        return { allowed: true };

      default:
        return { allowed: false, error: "Invalid resource type" };
    }

    // Free plan checks
    // if (resourceType === "profile") {
    //   const profileCount = await Profile.countDocuments({ userId });
    //   if (profileCount >= 1) {
    //     return {
    //       allowed: false,
    //       error: "Profile limit reached",
    //       limit: 1,
    //       current: profileCount
    //     };
    //   }
    // }

    // if (resourceType === "folder") {
    //   const folderCount = await Folder.countDocuments({ userId });
    //   if (folderCount >= 1) {
    //     return {
    //       allowed: false,
    //       error: "Folder limit reached",
    //       limit: 1,
    //       current: folderCount
    //     };
    //   }
    // }

    // if (resourceType === "image") {

    //  if (!folderId) {
    //     return { allowed: true };
    //   }

    //   const imageCount = await Image.countDocuments({ folderId, userId });
    //   if (imageCount >= 3) {
    //     return {
    //       allowed: false,
    //       error: "Image limit reached",
    //       limit: 3,
    //       current: imageCount
    //     };
    //   }
    // }

    // return { allowed: true };
  } catch (error) {
    console.error("Error checking plan limits:", error);
    return { allowed: false, error: "Internal server error" };
  }
}

// export async function middleware(request: NextRequest) {
//   const session = await getToken({ req: request });
//   const { pathname } = request.nextUrl;

//   // Protected admin routes
//   if (pathname.startsWith('/admin')) {
//     if (!session) {
//       const url = new URL('/login', request.url);
//       url.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(url);
//     }

//     if (!session.user?.isAdmin) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };

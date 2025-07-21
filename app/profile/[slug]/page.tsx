import SpeakerKitPreview from "@/components/Preview";
import connectViaMongoose from "@/lib/db";
import { SPEAKERKIT_BASE_URL } from "@/lib/utils";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    await connectViaMongoose();

    const user = await User.findOne({ slug }).select("-password");

    if (!user || user.isPublic === false) {
      return {
        title: "Profile Not Found | SpeakerKit",
        description:
          "The profile you're looking for doesn't exist or is not available.",
      };
    }

    const profiles = await Profile.find({ userId: user._id });
    const publicProfiles = profiles.filter(
      (profile) => profile.isPublic !== false
    );

    if (publicProfiles.length === 0) {
      return {
        title: "Profile Not Found | SpeakerKit",
        description:
          "The profile you're looking for doesn't exist or is not available.",
      };
    }

    // Get the first public profile for description
    const firstProfile = publicProfiles[0];
    const description =
      firstProfile.shortBio ||
      firstProfile.mediumBio ||
      firstProfile.longBio ||
      `${user.name}'s professional profile on SpeakerKit`;

    const title = `${user.name} | SpeakerKit`;
    const url = `${SPEAKERKIT_BASE_URL}/@${slug}`;

    return {
      title,
      description,
      icons: user.profileImage ? { icon: user.profileImage } : undefined,
      keywords: [
        user.name,
        "speaker",
        "presenter",
        "professional profile",
        "speaking",
        "conference",
        "event",
        "SpeakerKit",
      ],
      authors: [{ name: user.name }],
      creator: user.name,
      publisher: "SpeakerKit",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        type: "profile",
        title,
        description,
        url,
        siteName: "SpeakerKit",
        images: [
          {
            url: user.image || "/placeholder.svg",
            width: 1200,
            height: 630,
            alt: `${user.name}'s profile image`,
          },
        ],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [user.image || "/placeholder.svg"],
        creator: "@speakerkit",
        site: "@speakerkit",
      },
      alternates: {
        canonical: url,
      },
      other: {
        "twitter:label1": "Name",
        "twitter:data1": user.name,
        "twitter:label2": "Profile",
        "twitter:data2": "SpeakerKit",
      },
    };
  } catch (error) {
    return {
      title: "Profile | SpeakerKit",
      description: "Professional speaker profile on SpeakerKit",
    };
  }
}

export default async function Page({ params }: PageProps) {
  try {
    // Await params to get the username
    const { slug } = await params;

    // Connect to database
    await connectViaMongoose();

    // Find user by username
    const user = await User.findOne({ slug }).select("-password");

    if (!user || user.isPublic === false) {
      return (
        <div className='min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Profile Not Found
            </h1>
            <p className='text-gray-600'>
              The profile you&apos;re looking for doesn&apos;t exist or is not
              available.
            </p>
          </div>
        </div>
      );
    }

    // Fetch user's profiles
    const profiles = await Profile.find({ userId: user._id });

    // If all profiles are private, return 404
    const publicProfiles = profiles.filter(
      (profile) => profile.isPublic !== false
    );
    if (publicProfiles.length === 0) {
      return (
        <div className='min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Profile Not Found
            </h1>
            <p className='text-gray-600'>
              The profile you&apos;re looking for doesn&apos;t exist or is not
              available.
            </p>
          </div>
        </div>
      );
    }

    // Fetch user's folders with populated images
    const folders = await Folder.find({ userId: user._id }).populate({
      path: "images",
      model: Image,
      select: "name url uploadedAt",
    });

    // Transform the data to match the expected interface
    const userData = {
      name: user.name,
      email: user.email,
      image: user.image,
      location: "",
      createdAt: user.createdAt.toISOString(),
      website: "",
      country: "",
      tools: user.tools,
      theme: user.theme,
      isVerified: user.isVerified,
      socialMedia: user.socialMedia
        ? {
            twitter: user.socialMedia.twitter || "",
            linkedin: user.socialMedia.linkedin || "",
            instagram: user.socialMedia.instagram || "",
            email: user.socialMedia.email || user.email || "",
          }
        : {
            twitter: "",
            linkedin: "",
            instagram: "",
            email: user.email || "",
          },
    };

    const transformedProfiles = publicProfiles.map((profile) => {
      const plainProfile = profile.toObject();
      return {
        _id: plainProfile._id.toString(),
        title: plainProfile.title,
        shortBio: plainProfile.shortBio || "",
        mediumBio: plainProfile.mediumBio || "",
        longBio: plainProfile.longBio || "",
        isPublic: plainProfile.isPublic,
        isVerified: plainProfile.isVerified,
        updatedAt: plainProfile.updatedAt.toISOString(),
        createdAt: plainProfile.createdAt.toISOString(),
      };
    });

    const transformedFolders = folders.map((folder) => {
      const plainFolder = folder.toObject();
      return {
        _id: plainFolder._id.toString(),
        name: plainFolder.name,
        description: "", // Not available in current Folder model
        images: plainFolder.images.map((image: any) => ({
          _id: image._id.toString(),
          name: image.name,
          url: image.url,
          uploadedAt: image.uploadedAt.toISOString(),
        })),
        createdAt: plainFolder.createdAt.toISOString(),
      };
    });

    // Set default active profile
    const activeProfile =
      transformedProfiles.length > 0 ? transformedProfiles[0]._id : "";

    return (
      <SpeakerKitPreview
        userData={userData}
        profiles={transformedProfiles}
        folders={transformedFolders}
        activeProfile={activeProfile}
        userSlug={slug}
      />
    );
  } catch (error) {
    console.error("Error fetching profile data:", error);

    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Ah! We didn&apos;t expect that to happen.
          </h1>
          <p className='text-gray-600'>
            Check if the profile you&apos;re looking for exists and is
            available.
          </p>
        </div>
      </div>
    );
  }
}

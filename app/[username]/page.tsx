import SpeakerKitPreview from "@/components/Preview";
import connectViaMongoose from "@/lib/db";
import Folder from "@/models/Folders";
import Image from "@/models/Images";
import Profile from "@/models/Profile";
import User from "@/models/User";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function Page({ params }: PageProps) {
  try {
    // Await params to get the username
    const { username } = await params;

    // Connect to database
    await connectViaMongoose();

    // Find user by username
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return (
        <div className='min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Profile Not Found
            </h1>
            <p className='text-gray-600'>
              The profile you're looking for doesn't exist or is not available.
            </p>
          </div>
        </div>
      );
    }

    // Fetch user's profiles
    const profiles = await Profile.find({ userId: user._id });

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
      theme: user.theme,
    };

    const transformedProfiles = profiles.map((profile) => ({
      _id: profile._id.toString(),
      title: profile.title,
      shortBio: profile.shortBio || "",
      mediumBio: profile.mediumBio || "",
      longBio: profile.longBio || "",
      isPublic: profile.isPublic,
      isVerified: profile.isPublic, // Using isPublic as isVerified for now
      updatedAt: profile.updatedAt.toISOString(),
      createdAt: profile.createdAt.toISOString(),
    }));

    const transformedFolders = folders.map((folder) => ({
      _id: folder._id.toString(),
      name: folder.name,
      description: "", // Not available in current Folder model
      images: folder.images.map((image: any) => ({
        _id: image._id.toString(),
        name: image.name,
        url: image.url,
        uploadedAt: image.uploadedAt.toISOString(),
      })),
      createdAt: folder.createdAt.toISOString(),
    }));

    // Set default active profile
    const activeProfile =
      transformedProfiles.length > 0 ? transformedProfiles[0]._id : "";

    return (
      <SpeakerKitPreview
        username={username}
        userData={userData}
        profiles={transformedProfiles}
        folders={transformedFolders}
        activeProfile={activeProfile}
      />
    );
  } catch (error) {
    console.error("Error fetching profile data:", error);

    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Error</h1>
          <p className='text-gray-600'>
            Something went wrong while loading the profile.
          </p>
        </div>
      </div>
    );
  }
}

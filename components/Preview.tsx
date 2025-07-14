import { Folder } from "lucide-react";
import { DefaultTemplate } from "./templates/default";

interface Profile {
  _id: string;
  title: string;
  shortBio: string;
  mediumBio?: string;
  longBio?: string;
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
  isVerified: boolean;
}

interface Folder {
  _id: string;
  name: string;
  description: string;
  images: {
    _id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

interface UserData {
  name: string;
  email: string;
  image: string;
  location: string;
  createdAt: string;
  website: string;
  country: string;
  theme: string;
}

interface ProfilePreviewProps {
  userData: UserData;
  profiles: Profile[];
  folders: Folder[];
  activeProfile: string;
}

export default function ProfilePreview({
  userData,
  profiles,
  folders,
  activeProfile,
}: ProfilePreviewProps) {
  return (
    <DefaultTemplate
      userData={userData}
      profiles={profiles}
      folders={folders}
      activeProfile={activeProfile}
      selectedFolder={null}
    />
  );
}

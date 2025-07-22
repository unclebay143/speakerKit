import type { UserData } from "@/types/user";
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

interface ProfilePreviewProps {
  userData: UserData;
  profiles: Profile[];
  folders: Folder[];
  activeProfile: string;
  userSlug: string;
}

export default function ProfilePreview({
  userData,
  profiles,
  folders,
  activeProfile,
  userSlug,
}: ProfilePreviewProps) {
  return (
    <DefaultTemplate
      userData={userData}
      profiles={profiles}
      folders={folders}
      activeProfile={activeProfile}
      selectedFolder={null}
      userSlug={userSlug}
    />
  );
}

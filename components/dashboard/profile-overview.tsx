"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFolders } from "@/lib/hooks/useFolders";
import { useProfiles } from "@/lib/hooks/useProfiles";
import { format } from "date-fns";
import { Edit, FileText, Globe, ImageIcon, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { ProfileModal } from "../modals/profile-modal";
import { Skeleton } from "../ui/skeleton";

interface Profile {
  _id: string;
  title: string;
  shortBio?: string;
  mediumBio?: string;
  longBio?: string;
  updatedAt: string;
  isPublic: boolean;
}

const stats = [
  {
    label: "Total Profiles",
    value: "",
    icon: FileText,
    color: "text-blue-400",
  },
  {
    label: "Images Uploaded",
    value: "",
    icon: ImageIcon,
    color: "text-purple-400",
  },
  {
    label: "Public Profiles",
    value: "",
    icon: Globe,
    color: "text-orange-400",
  },
];

export function ProfilesOverview() {
  const { data: session } = useSession();
  const { folders: allFolders } = useFolders();

  const { profiles, isLoading, createProfile, updateProfile, deleteProfile } =
    useProfiles();

  const [, setEditingProfile] = useState<Profile | null>(null);

  const [profileModalState, setProfileModalState] = useState<{
    open: boolean;
    profileToEdit?: Profile;
  }>({ open: false });

  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    type?: "profile";
    id?: string;
    name?: string;
  }>({ open: false });

  const totalImages =
    allFolders?.reduce(
      (sum, folder) => sum + (folder.images?.length || 0),
      0
    ) || 0;

  const handleProfileCreated = async (
    newProfile: Omit<Profile, "_id" | "updatedAt">
  ) => {
    try {
      await createProfile.mutateAsync(newProfile);
      setProfileModalState({ open: false });
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  const handleProfileUpdated = async (
    id: string,
    updates: Partial<Profile>
  ) => {
    try {
      await updateProfile.mutateAsync({ id, ...updates });
      setProfileModalState({ open: false });
      setEditingProfile(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCreateProfile = () => {
    setProfileModalState({ open: true });
  };

  const handleEditProfile = (profile: Profile) => {
    setProfileModalState({ open: true, profileToEdit: profile });
  };

  const handleDeleteClick = (profileId: string, profileTitle: string) => {
    setDeleteModalState({
      open: true,
      type: "profile",
      id: profileId,
      name: profileTitle,
    });
  };

  const handleDeleteProfile = async () => {
    if (!deleteModalState.id) return;
    try {
      await deleteProfile.mutateAsync(deleteModalState.id);
      setDeleteModalState({ open: false });
    } catch (error) {
      console.error("Failed to delete profile:", error);
    }
  };

  const getBioBadges = (profile: Profile) => {
    const badges = [];

    if (profile.shortBio && profile.shortBio.trim()) {
      badges.push(
        <Badge
          key='short'
          variant='outline'
          className='text-xs border-green-500/30 text-green-300 bg-green-500/10'
        >
          Short
        </Badge>
      );
    }

    if (profile.mediumBio && profile.mediumBio.trim()) {
      badges.push(
        <Badge
          key='medium'
          variant='outline'
          className='text-xs border-blue-500/30 text-blue-300 bg-blue-500/10'
        >
          Medium
        </Badge>
      );
    }

    if (profile.longBio && profile.longBio.trim()) {
      badges.push(
        <Badge
          key='long'
          variant='outline'
          className='text-xs border-purple-500/30 text-purple-300 bg-purple-500/10'
        >
          Long
        </Badge>
      );
    }

    return badges;
  };

  if (isLoading) {
    return (
      <div className='space-y-6 mx-auto max-w-screen-lg'>
        <Skeleton className='h-32 w-full rounded-lg' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-32 w-full rounded-lg' />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-40 w-full rounded-lg' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      {/* First Section */}
      <div className='bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-white/10'>
        <h2 className='text-2xl font-bold text-white mb-2'>
          Welcome back, {session?.user?.name || "User"}! 👋
        </h2>
        <p className='text-gray-300'>
          You have {profiles?.length || 0} active profiles.
        </p>
      </div>

      {/* Statistics section of profile and images */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='bg-black/40 border-white/10'>
              <CardContent className='p-6 md:w-56 xl:w-80'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-gray-400 text-sm'>{stat.label}</p>
                    <p className='text-2xl font-bold text-white'>
                      {index === 0
                        ? profiles?.length || 0
                        : index === 1
                        ? totalImages
                        : profiles?.filter((p) => p.isPublic).length || 0}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profiles */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-semibold text-white'>Your Profiles</h3>
          <Button
            onClick={handleCreateProfile}
            className='bg-purple-600 hover:bg-purple-700 text-white'
          >
            Create New Profile
          </Button>
        </div>

        <div className='grid gap-4'>
          {profiles?.map((profile) => (
            <Card
              key={profile._id}
              className='bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-white text-[1.0rem] md:text-2xl flex items-center gap-2'>
                      {profile.title}
                      <Badge
                        variant={profile.isPublic ? "default" : "secondary"}
                        className='text-xs'
                      >
                        {profile.isPublic ? "Visible" : "Hidden"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className='text-gray-400 text-[0.8rem] mt-1'>
                      {profile.shortBio &&
                        (profile.shortBio.length > 50
                          ? `${profile.shortBio.substring(0, 50)}...`
                          : profile.shortBio)}
                    </CardDescription>
                  </div>
                  <div className='flex md:space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-gray-400 hover:text-white'
                      onClick={() => handleEditProfile(profile)}
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-red-400 hover:text-red-300'
                      onClick={() =>
                        handleDeleteClick(profile._id, profile.title)
                      }
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='md:flex items-center justify-between text-sm text-gray-400'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex space-x-1'>
                        {getBioBadges(profile)}
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 md:mt-0'>
                    <span className=''>
                      Updated{" "}
                      {format(new Date(profile.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {profiles?.length === 0 && (
          <Card className='bg-black/40 border-white/10 border-dashed'>
            <CardContent className='p-12 text-center'>
              <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-white mb-2'>
                No profiles yet
              </h3>
              <p className='text-gray-400 mb-6'>
                Create your first speaker profile to get started
              </p>
              <Button
                onClick={handleCreateProfile}
                className='bg-purple-600 hover:bg-purple-700'
              >
                Create Your First Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ProfileModal
        open={profileModalState.open}
        onOpenChange={(open) =>
          setProfileModalState({ ...profileModalState, open })
        }
        onProfileCreated={handleProfileCreated}
        onProfileUpdated={handleProfileUpdated}
        profileToEdit={profileModalState.profileToEdit}
        isEditing={!!profileModalState.profileToEdit}
      />
      <DeleteConfirmationModal
        open={deleteModalState.open}
        onOpenChange={(open) =>
          setDeleteModalState({ ...deleteModalState, open })
        }
        onConfirm={handleDeleteProfile}
        title={deleteModalState.name}
        type='profile'
      />
    </div>
  );
}

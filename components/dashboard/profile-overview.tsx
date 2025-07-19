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
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useFolders } from "@/lib/hooks/useFolders";
import { useProfiles } from "@/lib/hooks/useProfiles";
import { slugify } from "@/lib/utils";
import { format } from "date-fns";
import {
  Check,
  Copy,
  Edit,
  FileText,
  Globe,
  ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { ProfileModal } from "../modals/profile-modal";
import { UpgradeModal } from "../modals/upgrade-modal";
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
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Images Uploaded",
    value: "",
    icon: ImageIcon,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    label: "Public Profiles",
    value: "",
    icon: Globe,
    color: "text-orange-600 dark:text-orange-400",
  },
];

export function ProfilesOverview() {
  const { folders: allFolders } = useFolders();
  const { data: user } = useCurrentUser();

  const { profiles, isLoading, createProfile, updateProfile, deleteProfile } =
    useProfiles();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const [, setEditingProfile] = useState<Profile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      const result = await createProfile.mutateAsync(newProfile);

      if (result?.error && result.limitReached) {
        setUpgradeModalOpen(true);
        return;
      }

      setProfileModalState({ open: false });
    } catch (error: any) {
      console.error("Failed to create profile:", error);

      if (error?.response?.data?.limitReached) {
        setUpgradeModalOpen(true);
      }
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
    const isPaidUser = user?.isPro || user?.isLifetime;

    if (!isPaidUser && profiles && profiles.length >= 1) {
      setUpgradeModalOpen(true);
      return;
    }

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

  const [copiedProfileId, setCopiedProfileId] = useState<string | null>(null);

  const handleCopyProfileUrl = async (profile: Profile) => {
    if (!user?.slug) return;

    const profileSlug = slugify(profile.title);
    const profileUrl = `${window.location.origin}/@${user.slug}?profile=${profileSlug}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopiedProfileId(profile._id);
      setTimeout(() => setCopiedProfileId(null), 2000);
    } catch (error) {
      console.error("Failed to copy profile URL:", error);
    }
  };

  const handleDeleteProfile = async () => {
    if (!deleteModalState.id) return;
    try {
      setDeletingId(deleteModalState.id);
      await deleteProfile.mutateAsync(deleteModalState.id);
      setDeleteModalState({ open: false });
    } catch (error) {
      console.error("Failed to delete profile:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getBioBadges = (profile: Profile) => {
    const badges = [];

    if (profile.shortBio && profile.shortBio.trim()) {
      badges.push(
        <Badge
          key='short'
          variant='outline'
          className='text-xs border-green-500/30 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-500/10'
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
          className='text-xs border-blue-500/30 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10'
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
          className='text-xs border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10'
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
    <div className='flex flex-col gap-6 mx-auto max-w-screen-lg'>
      {/* First Section */}
      <div className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-600/20 dark:to-pink-600/20 rounded-lg p-6 border border-purple-200 dark:border-white/10'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Welcome back, {user?.name || "User"}! 👋
        </h2>
        <p className='text-gray-600 dark:text-gray-300'>
          You have {profiles?.length || 0} active profiles.
        </p>
      </div>

      {/* Statistics section of profile and images */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'
            >
              <CardContent className='p-6 md:w-56 xl:w-80'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {stat.label}
                    </p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
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
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Your Profiles
          </h3>
          <Button
            onClick={handleCreateProfile}
            className={`bg-purple-600 hover:bg-purple-700 text-white`}
          >
            Create New Profile
          </Button>
        </div>

        <div className='grid gap-4'>
          {profiles?.map((profile) => (
            <Card
              key={profile._id}
              className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md transition-colors'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-[1.0rem] md:text-2xl flex items-center gap-2 text-gray-900 dark:text-white'>
                      {profile.title}
                      <Badge
                        variant={profile.isPublic ? "default" : "secondary"}
                        className={`text-xs ${
                          profile.isPublic
                            ? "bg-purple-100 dark:bg-purple-600/20 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-500/30"
                            : "bg-gray-100 dark:bg-gray-600/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-500/30"
                        }`}
                      >
                        {profile.isPublic ? "Visible" : "Hidden"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className='text-[0.8rem] mt-1 text-gray-600 dark:text-gray-400'>
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
                      className={`${
                        copiedProfileId === profile._id
                          ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      }`}
                      onClick={() => handleCopyProfileUrl(profile)}
                      title={
                        copiedProfileId === profile._id
                          ? "Copied!"
                          : "Copy profile URL"
                      }
                    >
                      {copiedProfileId === profile._id ? (
                        <Check className='w-4 h-4' />
                      ) : (
                        <Copy className='w-4 h-4' />
                      )}
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                      onClick={() => handleEditProfile(profile)}
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={`text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 ${
                        deletingId === profile._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        handleDeleteClick(profile._id, profile.title)
                      }
                      disabled={deletingId === profile._id}
                    >
                      {deletingId === profile._id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='md:flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
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
          <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 border-dashed'>
            <CardContent className='p-12 text-center'>
              <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No profiles yet
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Create your first speaker profile to get started
              </p>
              <Button
                onClick={handleCreateProfile}
                className='bg-purple-600 hover:bg-purple-700 text-white'
              >
                Create Your First Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* {(user?.plan !== "free" || (profiles?.length ?? 0) < 1) && ( */}
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
      {/* )} */}

      <DeleteConfirmationModal
        open={deleteModalState.open}
        onOpenChange={(open) =>
          setDeleteModalState({ ...deleteModalState, open })
        }
        onConfirm={handleDeleteProfile}
        title={deleteModalState.name}
        type='profile'
        loading={deletingId === deleteModalState.id}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        limitType={"profile"}
      />
    </div>
  );
}

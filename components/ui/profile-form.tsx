"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ProfileFormData {
  title: string;
  shortBio: string;
  mediumBio: string;
  longBio: string;
}

interface ProfileFormProps {
  profileToEdit?: any;
  isEditing?: boolean;
  onSubmit: (data: ProfileFormData & { isPublic: boolean }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProfileForm({
  profileToEdit,
  isEditing = false,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProfileFormProps) {
  const [isPublic, setIsPublic] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    title: "",
    shortBio: "",
    mediumBio: "",
    longBio: "",
  });

  useEffect(() => {
    if (isEditing && profileToEdit) {
      setProfileData({
        title: profileToEdit.title,
        shortBio: profileToEdit.shortBio || "",
        mediumBio: profileToEdit.mediumBio || "",
        longBio: profileToEdit.longBio || "",
      });
      setIsPublic(profileToEdit.isPublic);
    } else {
      setProfileData({
        title: "",
        shortBio: "",
        mediumBio: "",
        longBio: "",
      });
      setIsPublic(true);
    }
  }, [isEditing, profileToEdit]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!profileData.title.trim()) {
        return;
      }

      await onSubmit({
        ...profileData,
        isPublic,
      });
    },
    [profileData, isPublic, onSubmit]
  );

  const handleCancel = useCallback(() => {
    setProfileData({
      title: "",
      shortBio: "",
      mediumBio: "",
      longBio: "",
    });
    setIsPublic(true);
    onCancel();
  }, [onCancel]);

  const maxLengths = {
    shortBio: 350,
    mediumBio: 900,
    longBio: 2500,
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-auto space-y-6'>
        <div className='flex flex-col gap-4'>
          {/* Profile Title */}
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-gray-900 dark:text-white'>
              Profile Title *
            </Label>
            <Input
              id='title'
              placeholder='e.g., Speaker Bio'
              value={profileData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Bio Sections */}
          <div className='space-y-4'>
            <div>
              <Label className='text-gray-900 dark:text-white text-sm font-medium'>
                Biography Versions
              </Label>
              <p className='text-xs text-gray-600 dark:text-gray-400 mb-3'>
                Create different Biography versions (short, medium or long)
              </p>
            </div>

            {/* Short Bio */}
            <div className='space-y-2'>
              <Label
                htmlFor='shortBio'
                className='text-gray-900 dark:text-white text-sm'
              >
                Quick Bio ({maxLengths.shortBio} characters max) *
              </Label>
              <Textarea
                id='shortBio'
                placeholder='Brief introduction for quick references and social media'
                value={profileData.shortBio}
                onChange={(e) => handleInputChange("shortBio", e.target.value)}
                maxLength={maxLengths.shortBio}
                className='min-h-6'
              />
              <p className='text-xs text-gray-600 dark:text-gray-400 text-right'>
                {profileData.shortBio.length}/{maxLengths.shortBio} characters
              </p>
            </div>

            {/* Medium Bio */}
            <div className='space-y-2'>
              <Label
                htmlFor='mediumBio'
                className='text-gray-900 dark:text-white text-sm'
              >
                Medium Bio ({maxLengths.mediumBio} characters max)
              </Label>
              <Textarea
                id='mediumBio'
                placeholder='Detailed bio for event programs and professional introductions'
                value={profileData.mediumBio}
                onChange={(e) => handleInputChange("mediumBio", e.target.value)}
                maxLength={maxLengths.mediumBio}
                className='min-h-28'
              />
              <p className='text-xs text-gray-600 dark:text-gray-400 text-right'>
                {profileData.mediumBio.length}/{maxLengths.mediumBio} characters
              </p>
            </div>

            {/* Long Bio */}
            <div className='space-y-2'>
              <Label
                htmlFor='longBio'
                className='text-gray-900 dark:text-white text-sm'
              >
                Full Bio (Full biography, {maxLengths.longBio} characters max)
              </Label>
              <Textarea
                id='longBio'
                placeholder='Complete biography with full background, achievements, and experience'
                value={profileData.longBio}
                onChange={(e) => handleInputChange("longBio", e.target.value)}
                maxLength={maxLengths.longBio}
                className='min-h-32'
              />
              <p className='text-xs text-gray-600 dark:text-gray-400 text-right'>
                {profileData.longBio.length}/{maxLengths.longBio} characters
              </p>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10'>
            <div className='flex items-center space-x-3'>
              {isPublic ? (
                <Eye className='w-5 h-5 text-green-600 dark:text-green-400' />
              ) : (
                <EyeOff className='w-5 h-5 text-gray-500 dark:text-gray-400' />
              )}
              <div>
                <Label className='text-gray-900 dark:text-white'>
                  Profile Visibility
                </Label>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {isPublic
                    ? "Public - Include this profile on your speaker page"
                    : "Private - Hide this profile from your speaker page"}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex space-x-3 shrink-0 bg-white dark:bg-black py-4 z-20'>
        <Button
          type='button'
          variant='outline'
          onClick={handleCancel}
          className='flex-1 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='button'
          onClick={() => handleSubmit()}
          disabled={!profileData.title || !profileData.shortBio || isLoading}
          className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'
        >
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : isEditing ? (
            "Update Profile"
          ) : (
            "Create Profile"
          )}
        </Button>
      </div>
    </div>
  );
}

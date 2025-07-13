"use client";

import { ProfileForm } from "@/components/ui/profile-form";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useCallback, useState } from "react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileCreated?: (profile: any) => void;
  onProfileUpdated?: (id: string, updates: any) => Promise<void>;
  profileToEdit?: any;
  isEditing?: boolean;
}

export function ProfileModal({
  open,
  onOpenChange,
  onProfileCreated,
  onProfileUpdated,
  profileToEdit,
  isEditing = false,
}: ProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const heading = isEditing ? "Edit Profile" : "Create New Profile";
  const description = "Set up a new profile for different contexts";

  const handleSubmit = useCallback(
    async (data: any) => {
      setIsLoading(true);

      try {
        if (isEditing && profileToEdit) {
          await onProfileUpdated?.(profileToEdit._id, data);
        } else {
          await onProfileCreated?.(data);
        }
        onOpenChange(false);
      } catch (error) {
        console.error("Error creating profile:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isEditing, profileToEdit, onProfileCreated, onProfileUpdated, onOpenChange]
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      heading={heading}
      description={description}
      className='max-w-2xl max-h-[90vh]'
    >
      <ProfileForm
        profileToEdit={profileToEdit}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </ResponsiveModal>
  );
}

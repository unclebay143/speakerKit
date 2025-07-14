"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  type?: "profile" | "folder" | "image";
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  type = "profile",
}: DeleteConfirmationModalProps) {
  const defaultDescriptions = {
    profile: title
      ? `Are you sure you want to delete "${title}"?`
      : "Are you sure you want to delete this profile?",
    folder: title
      ? `Are you sure you want to delete "${title}" and all its contents?`
      : "Are you sure you want to delete this folder and all its contents?",
    image: title
      ? `Are you sure you want to delete "${title}"?`
      : "Are you sure you want to delete this image?",
  };

  const modalTitle = {
    profile: "Delete Profile",
    folder: "Delete Folder",
    image: "Delete Image",
  }[type];

  const displayDescription = description || defaultDescriptions[type];

  const footer = (
    <div className='flex space-x-3'>
      <Button
        variant='outline'
        onClick={() => onOpenChange(false)}
        className='flex-1 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
      >
        Cancel
      </Button>
      <Button
        variant='destructive'
        className='flex-1'
        onClick={() => {
          onConfirm();
          onOpenChange(false);
        }}
      >
        Delete
      </Button>
    </div>
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      heading={modalTitle}
      description={displayDescription}
      footer={footer}
      className='sm:max-w-[425px]'
    />
  );
}

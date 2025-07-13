"use client";

import { FolderForm } from "@/components/ui/folder-form";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useCallback, useState } from "react";

interface CreateFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFolderCreated?: (folderName: string) => void;
  initialName?: string;
}

export function CreateFolderModal({
  open,
  onOpenChange,
  onFolderCreated,
  initialName = "",
}: CreateFolderModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (folderName: string) => {
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onFolderCreated?.(folderName);
        onOpenChange(false);
      } catch (error) {
        console.error("Error creating folder:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onFolderCreated, onOpenChange]
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isEditMode = !!initialName;
  const heading = isEditMode ? "Rename Folder" : "Create New Folder";
  const description = "Organize your images into folders";

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      heading={heading}
      description={description}
      className='max-w-md'
    >
      <FolderForm
        initialName={initialName}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </ResponsiveModal>
  );
}

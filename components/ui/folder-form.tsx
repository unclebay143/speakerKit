"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

interface FolderFormProps {
  initialName?: string;
  isEditMode?: boolean;
  onSubmit: (folderName: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FolderForm({
  initialName = "",
  isEditMode = false,
  onSubmit,
  onCancel,
  isLoading = false,
}: FolderFormProps) {
  const [folderName, setFolderName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFolderName(initialName);
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    await onSubmit(folderName.trim());
    setFolderName("");
  };

  const handleCancel = () => {
    setFolderName("");
    onCancel();
  };

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='folderName' className='text-gray-900 dark:text-white'>
            Folder Name
          </Label>
          <Input
            id='folderName'
            placeholder='e.g., Professional Headshots, Casual Headshots, etc.'
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className='bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500'
            required
            maxLength={50}
            ref={inputRef}
          />
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            {folderName.length}/50 characters
          </p>
        </div>
      </form>

      {/* Action Buttons */}
      <div className='flex space-x-3'>
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
          onClick={handleSubmit}
          disabled={!folderName.trim() || isLoading}
          className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'
        >
          {isLoading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Folder"
            : "Create Folder"}
        </Button>
      </div>
    </div>
  );
}

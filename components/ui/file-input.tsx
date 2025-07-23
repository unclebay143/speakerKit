"use client";

import { formatMaxFileSize } from "@/lib/file-constants";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";

interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (file: File | null) => void;
  accept?: string;
  className?: string;
  label?: string;
  existingImage?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onChange, accept, label, existingImage, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Set existing image as preview if no file is selected
    React.useEffect(() => {
      if (!selectedFile && existingImage) {
        setPreviewUrl(existingImage);
      }
    }, [existingImage, selectedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);

      // Create preview URL for image files
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (!file && existingImage) {
        // If no file selected but we have existing image, show it
        setPreviewUrl(existingImage);
      } else {
        setPreviewUrl(null);
      }

      onChange?.(file);
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleRemove = () => {
      setSelectedFile(null);
      setPreviewUrl(existingImage || null); // Keep existing image if available
      onChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    // Cleanup preview URL on unmount
    React.useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    return (
      <div className={cn("space-y-3", className)}>
        <div
          onClick={handleClick}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
          )}
        >
          <div className='flex items-center space-x-2'>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt='Preview'
                width={24}
                height={24}
                className='rounded object-cover'
              />
            ) : (
              <Upload className='h-4 w-4 text-gray-500 dark:text-gray-400' />
            )}
            <span
              className={
                selectedFile || existingImage
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }
            >
              {selectedFile
                ? selectedFile.name
                : existingImage
                ? "Current image selected"
                : label || "Choose file"}
            </span>
          </div>
          {(selectedFile || existingImage) && (
            <div className='flex items-center space-x-2'>
              {selectedFile && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {formatMaxFileSize(selectedFile.size)}
                </span>
              )}
              {existingImage && !selectedFile && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  Current image
                </span>
              )}
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          )}
        </div>

        <input
          ref={(node) => {
            // Handle both refs
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            fileInputRef.current = node;
          }}
          type='file'
          accept={accept}
          onChange={handleFileChange}
          className='hidden'
          {...props}
        />
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  onUploadComplete: (files: File[]) => void;
  // onUploadComplete: () => void;
}

export function UploadModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    onDropRejected: (rejectedFiles) => {
      const firstError = rejectedFiles[0].errors[0];
      if (firstError.code === "file-too-large") {
        alert(`File is too large. Max size is 10MB`);
      } else if (firstError.code === "file-invalid-type") {
        alert("Only JPG, PNG, and WebP images are allowed");
      }
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      await onUploadComplete(files);
      setFiles([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-white dark:bg-black/95 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-gray-900 dark:text-white'>
            Upload Images
          </DialogTitle>
          <DialogDescription className='text-gray-600 dark:text-gray-400'>
            Drag and drop your images here, or click to browse
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-gray-300 dark:border-white/10"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
          <p className='text-gray-600 dark:text-gray-400'>
            {isDragActive
              ? "Drop the files here"
              : "Drag & drop images here, or click to select"}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            Supported formats: JPG, PNG, WebP. Max size: 10MB
          </p>
          <Button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
            variant='outline'
            className='mt-4 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
          >
            Choose Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className='space-y-2 max-h-60 overflow-y-auto'>
            <h4 className='font-medium text-gray-900 dark:text-white'>
              Selected Files
            </h4>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  {/* Preview */}
                  <div className='relative w-10 h-10 flex-shrink-0'>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className='object-cover rounded'
                      unoptimized
                    />
                    
                  </div>

                  {/* File Name */}
                  <span className='truncate text-sm flex-1 text-gray-900 dark:text-white'>
                    {file.name}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={uploading}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            onClick={() => {
              setFiles([]);
              onOpenChange(false);
            }}
            className='border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className='bg-purple-600 hover:bg-purple-700 text-white'
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

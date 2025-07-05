"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  onUploadComplete: () => void;
}

export function UploadModal({ open, onOpenChange, folderId, onUploadComplete }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open: openFileDialog } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, 
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("folderId", folderId);
//       files.forEach((file) => {
//         formData.append("file", file);
//       });

//       const response = await fetch("/api/images/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         onUploadComplete();
//         setFiles([]);
//         onOpenChange(false);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };
const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    try {
      await onUploadComplete(files)
      setFiles([])
      onOpenChange(false)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Drag and drop your images here, or click to browse
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? "border-purple-500 bg-purple-500/10" : "border-white/10"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">
            {isDragActive
              ? "Drop the files here"
              : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, WebP. Max size: 10MB
          </p>
           <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openFileDialog()
            }}
            variant="outline"
            className="mt-4 border-white/10 text-white bg-transparent"
          >
            Choose Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h4 className="font-medium">Selected Files</h4>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white/5 rounded"
              >
                <span className="truncate text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setFiles([]);
              onOpenChange(false);
            }}
            className="border-white/10 text-white bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMaxFileSize, MAX_FILE_SIZE } from "@/lib/file-constants";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useFolders } from "@/lib/hooks/useFolders";
import { useImage } from "@/lib/hooks/useImage";
import axios from "axios";
import {
  ChevronRight,
  Edit,
  Eye,
  Folder,
  FolderPlus,
  Loader2,
  MoreVertical,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { EmptyState } from "../EmptyState";
import { CreateFolderModal } from "../modals/folder-modal";
import { UpgradeModal } from "../modals/upgrade-modal";
import { UploadModal } from "../UploadModal";

interface Folder {
  _id: string;
  name: string;
  images: Image[];
  imageCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface Image {
  _id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export function ImageGallery() {
  // const { data: session } = useSession();
  const { data: user } = useCurrentUser();
  const { deleteImage } = useImage();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const [uploading, setUploading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  // const [uploadModalFiles, setUploadModalFiles] = useState<File[]>([]);
  const [limitData, setLimitData] = useState({
    limitType: "folder" as "folder" | "profile" | "images",
    current: 0,
    limit: 0,
  });

  const pathname = usePathname();
  const router = useRouter();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
      setShowUploadModal(true);
      // handleImageUploaded(acceptedFiles);
    },
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
        alert(
          `File is too large. Max size is ${Math.round(MAX_FILE_SIZE / 1024)}KB`
        );
      } else if (firstError.code === "file-invalid-type") {
        alert("Only JPG, PNG, and WebP images are allowed");
      }
    },
  });

  const folderId = pathname.startsWith("/gallery/")
    ? pathname.split("/").pop()
    : null;
  const [folderModalState, setFolderModalState] = useState({
    open: false,
    folderToEdit: null as { id: string; name: string } | null,
  });

  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    type?: "folder" | "image";
    id?: string;
    name?: string;
  }>({ open: false });

  const {
    folders,
    isLoading: foldersLoading,
    useFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadImage,
  } = useFolders();

  const { data: currentFolder, isLoading: folderLoading } = useFolder(
    folderId || null
  );

  const handleFolderCreated = async (folderName: string) => {
    try {
      const result = await createFolder.mutateAsync(folderName);
      router.push(`/gallery/${result._id}`);
    } catch (error) {
      if (error instanceof Error && error.message === "FOLDER_LIMIT_REACHED") {
        setLimitData({
          limitType: "folder",
          current: folders?.length || 0,
          limit: 1,
        });
        setUpgradeModalOpen(true);
      } else {
        console.error("Error creating folder:", error);
      }
    }
  };

  const handleFolderUpdated = async (folderName: string) => {
    if (!folderModalState.folderToEdit) return;

    try {
      await updateFolder.mutateAsync({
        id: folderModalState.folderToEdit.id,
        name: folderName,
      });
      setFolderModalState({ open: false, folderToEdit: null });
    } catch (error) {
      console.error("Failed to update folder:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!user?._id) return;
    try {
      if (!user.isPro && folders && folders.length >= 2) {
        setLimitData({
          limitType: "folder",
          current: folders.length,
          limit: 2,
        });
        setUpgradeModalOpen(true);
        return;
      }

      setFolderModalState({ open: true, folderToEdit: null });
    } catch (error) {
      console.error("Error checking folder limits:", error);
    }
  };

  const handleEditFolder = (folder: { id: string; name: string }) => {
    setFolderModalState({
      open: true,
      folderToEdit: {
        id: folder.id.toString(),
        name: folder.name,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalState.id) return;

    try {
      setDeletingId(deleteModalState.id);
      if (deleteModalState.type === "folder") {
        await deleteFolder.mutateAsync(deleteModalState.id);
      } else if (deleteModalState.type === "image") {
        await deleteImage.mutateAsync(deleteModalState.id);
      }
      setDeleteModalState({ open: false });
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageUploaded = async (files: File[]) => {
    if (!currentFolder) return;

    try {
      if (!user?.isPro && currentFolder.images.length + files.length > 3) {
        setLimitData({
          limitType: "images",
          current: currentFolder.images.length,
          limit: 3,
        });
        setUpgradeModalOpen(true);
        // Throw an error to prevent the upload modal from closing
        throw new Error("IMAGE_LIMIT_REACHED");
      }

      const validUploads: any[] = [];

      for (const file of files) {
        try {
          const response = await uploadImage.mutateAsync({
            folderId: currentFolder._id.toString(),
            file,
          });

          validUploads.push(response);
        } catch (error: any) {
          if (error.message === "IMAGE_LIMIT_REACHED") {
            const updatedFolder = await axios.get(
              `/api/folders/${currentFolder._id}`
            );
            setLimitData({
              limitType: "images",
              current: updatedFolder.data.images.length,
              limit: 3,
            });
            setUpgradeModalOpen(true);
            // Re-throw the error to prevent the upload modal from closing
            throw error;
          } else {
            console.error("Unexpected upload error:", error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("General upload error:", error);
      // Re-throw the error to prevent the upload modal from closing
      throw error;
    }
  };

  if (foldersLoading || folderLoading) {
    return (
      <div className='space-y-6 mx-auto max-w-screen-lg py-10'>
        <Skeleton className='h-10 w-1/3 rounded-lg' />
        <Skeleton className='h-6 w-1/2 rounded-lg' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-32 w-full rounded-lg' />
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-40 w-full rounded-lg' />
          ))}
        </div>
      </div>
    );
  }

  // const removeFile = (index: number) => {
  //   setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  // };

  // const handleCancelUpload = () => {
  //   setSelectedFiles([]);
  // };

  // const handleUploadFiles = async () => {
  //   if (selectedFiles.length === 0) return;

  //   setUploading(true);
  //   try {
  //     await handleImageUploaded(selectedFiles);
  //     setSelectedFiles([]);
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
    <div className='flex flex-col gap-4 mx-auto max-w-screen-lg'>
      {/* Header part */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}
      >
        {/* Title Section */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            {currentFolder && (
              <>
                <Link href='/gallery'>
                  <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer truncate'>
                    Gallery
                  </h2>
                </Link>
                <ChevronRight className='w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0' />
              </>
            )}
            <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900/80 dark:text-white/80 truncate'>
              {currentFolder ? currentFolder.name : "Gallery"}
            </h2>
          </div>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1'>
            Manage your headshots and profile images
          </p>
        </div>

        {/* Actions Section */}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {!currentFolder ? (
            <Button
              onClick={handleCreateFolder}
              variant='outline'
              size='sm'
              className='border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
            >
              <FolderPlus className='w-4 h-4' />
              <span>New Folder</span>
            </Button>
          ) : (
            <Button
              size='sm'
              className='bg-purple-600 hover:bg-purple-700 text-white'
              onClick={(e) => {
                e.stopPropagation();
                if (!user?.isPro && currentFolder.images.length >= 3) {
                  setLimitData({
                    limitType: "images",
                    current: currentFolder.images.length,
                    limit: 3,
                  });
                  setUpgradeModalOpen(true);
                } else {
                  openFileDialog();
                }
              }}
            >
              <Upload className='w-4 h-4' />
              <span>Upload Images</span>
            </Button>
          )}
        </div>
      </div>

      {/* Upload section  */}
      {currentFolder && currentFolder.images.length === 0 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
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
            Supported formats: JPG, PNG, WebP. Max size:{" "}
            {formatMaxFileSize(MAX_FILE_SIZE)}
          </p>
          <Button
            type='button'
            onClick={() => {
              if (!user?.isPro && currentFolder.images.length >= 3) {
                setLimitData({
                  limitType: "images",
                  current: currentFolder.images.length,
                  limit: 3,
                });
                setUpgradeModalOpen(true);
              } else {
                openFileDialog();
              }
            }}
            variant='outline'
            className='mt-4 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
          >
            Choose Files
          </Button>
        </div>
      )}

      {currentFolder ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
          {currentFolder.images.map((image) => (
            <Card
              key={image._id}
              className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'
            >
              <CardContent className='p-4'>
                <img
                  src={image.url}
                  alt={image.name}
                  className='w-full h-60 object-cover rounded mb-2'
                />
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white truncate max-w-[180px]'>
                      {image.name}
                    </h4>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                      >
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        className='text-red-400'
                        onClick={() => {
                          setDeleteModalState({
                            open: true,
                            type: "image",
                            id: image._id,
                            name: image.name,
                          });
                        }}
                      >
                        <Trash2 className='w-4 h-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Folders Grid */
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
          {folders?.map((folder) => (
            <Card
              key={folder._id}
              className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md transition-colors'
            >
              <CardContent className='p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <Link href={`/gallery/${folder._id}`} className='block'>
                      <div className='flex items-center space-x-3 mb-2'>
                        <Folder className='w-8 h-8 text-purple-600 dark:text-purple-400' />
                        <div>
                          <h4 className='font-medium text-gray-900 dark:text-white truncate max-w-[280px] md:max-w-[210px] hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
                            {folder.name}
                          </h4>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {folder.images.length} images
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className={`h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
                          deletingId === folder._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={deletingId === folder._id}
                      >
                        {deletingId === folder._id ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <MoreVertical className='w-4 h-4' />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link href={`/gallery/${folder._id}`}>
                          <Eye className='w-4 h-4' />
                          Open
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFolder({
                            id: folder._id.toString(),
                            name: folder.name,
                          });
                        }}
                      >
                        <Edit className='w-4 h-4' />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModalState({
                            open: true,
                            type: "folder",
                            id: folder._id,
                            name: folder.name,
                          });
                        }}
                        className='text-red-400'
                        disabled={deletingId === folder._id}
                      >
                        <Trash2 className='w-4 h-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className='text-xs text-gray-500'>
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      <div className='space-y-4'>
        {!currentFolder && folders?.length === 0 && (
          <EmptyState
            icon={Folder}
            title='No Folders Yet'
            description='Create your first folder to organize your images'
            action={{
              label: "Create Folder",
              onClick: handleCreateFolder,
            }}
          />
        )}
      </div>

      {/* Create Folder Modal */}
      {folderModalState.open && (
        <CreateFolderModal
          open={folderModalState.open}
          onOpenChange={(open) =>
            setFolderModalState({ ...folderModalState, open })
          }
          onFolderCreated={
            folderModalState.folderToEdit
              ? handleFolderUpdated
              : handleFolderCreated
          }
          initialName={folderModalState.folderToEdit?.name || ""}
        />
      )}
      {currentFolder && !upgradeModalOpen && (
        <UploadModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          folderId={currentFolder._id}
          onUploadComplete={handleImageUploaded}
          files={selectedFiles}
          onFilesChange={setSelectedFiles}
        />
      )}

      <DeleteConfirmationModal
        open={deleteModalState.open}
        onOpenChange={(open) =>
          setDeleteModalState({ ...deleteModalState, open })
        }
        onConfirm={handleDeleteConfirm}
        title={deleteModalState.name}
        type={deleteModalState.type || "folder"}
        loading={deletingId === deleteModalState.id}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={(open) => {
          setUpgradeModalOpen(open);
        }}
        limitType={limitData.limitType}
        currentCount={limitData.current}
        limit={limitData.limit}
        isPro={user?.isPro === "pro"}
      />
    </div>
  );
}

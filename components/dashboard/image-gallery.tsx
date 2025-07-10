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
import { useFolders } from "@/lib/hooks/useFolders";
import { useImage } from "@/lib/hooks/useImage";
import axios from "axios";
import {
  ChevronRight,
  Edit,
  Eye,
  Folder,
  FolderPlus,
  MoreVertical,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { CreateFolderModal } from "../modals/folder-modal";
import { UploadModal } from "../UploadModal";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

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
  const { data: session, update } = useSession();
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const { deleteImage } = useImage();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const folderId = pathname.startsWith('/gallery/') 
    ? pathname.split('/').pop()
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
const [loading, setLoading] = useState(false);
  


  const {
    folders,
    // isLoading,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadImage,
  } = useFolders();

  // useEffect(() => {
  //   if (initialFolderId) {
  //     const loadInitialFolder = async () => {
  //       try {
  //         const folder = await getFolder.mutateAsync(initialFolderId);
  //         setCurrentFolder(folder);
  //       } catch (error) {
  //         console.error("Failed to load initial folder:", error);
  //       }
  //     };
  //     loadInitialFolder();
  //   }
  // }, [initialFolderId]);

  

  const handleFolderClick = (folder: Folder) => {
    if (!folder?._id) return;
    router.push(`/gallery/${folder._id}`);
  };


 useEffect(() => {
  const loadFolder = async () => {
    if (!folderId || folderId === 'gallery') {
      setCurrentFolder(null);
      return;
    }

    try {
      setLoading(true);
      const folderData = await getFolder(folderId);
      setCurrentFolder(folderData);
    } catch (err) {
      console.error("Error loading folder:", err);
      router.push("/gallery");
    } finally {
      setLoading(false);
    }
  };

  loadFolder();
}, [folderId]);

  const handleBackToGallery = () => {
    router.push('/gallery');
  };

   

  const handleFolderCreated = async (folderName: string) => {
    try {
      await createFolder.mutateAsync(folderName);
      // setCurrentFolder({
      //   ...response.data,
      //   _id: response.data._id.toString()
      // });
    } catch (error) {
      console.error("Error creating folder:", error);
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

      if (currentFolder?._id === folderModalState.folderToEdit.id) {
        const updated = await getFolder(folderModalState.folderToEdit.id);
        setCurrentFolder(updated);
      }
    } catch (error) {
      console.error("Failed to update folder:", error);
    }
  };

  const handleCreateFolder = () => {
    setFolderModalState({ open: true, folderToEdit: null });
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
      if (deleteModalState.type === "folder") {
        await deleteFolder.mutateAsync(deleteModalState.id);
        setCurrentFolder(null);
      } else if (deleteModalState.type === "image") {
        await deleteImage.mutateAsync(deleteModalState.id);
        if (currentFolder) {
          const { data } = await axios.get(`/api/folders/${currentFolder._id}`);
          setCurrentFolder(data);
        }
      }
      setDeleteModalState({ open: false });
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleImageUploaded = async (files: File[]) => {
    if (!currentFolder) return;

    try {
      const responses = await Promise.all(
        files.map((file) =>
          uploadImage.mutateAsync({
            folderId: currentFolder._id.toString(),
            file,
          })
        )
      );
      const { data } = await axios.get(`/api/folders/${currentFolder._id}`);
      setCurrentFolder(data);

      if (responses.length > 0 && !session?.user?.image) {
      const firstResponse = responses[0];
      const updateResponse = await axios.put('/api/users/update-from-gallery', {
            imageUrl: firstResponse.data.image.url
          });
          
          if (updateResponse.data?.success) {
            await update({
              image: updateResponse.data.image
            });
          }
        }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };



  if (loading) {
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

  return (
    <div className='flex flex-col gap-4 mx-auto max-w-screen-lg'>
      {/* Header part */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              {currentFolder && (
                <>
                  <button onClick={handleBackToGallery}>
                    <h2 className='text-2xl font-bold text-white'>
                      Image Gallery
                    </h2>
                  </button>

                  <ChevronRight className='w-4 h-4' />
                </>
              )}
              <h2 className='text-2xl font-bold text-white/80'>
                {currentFolder ? currentFolder.name : "Image Gallery"}
              </h2>
            </div>
            <p className='text-gray-400'>
              Manage your headshots and profile images
            </p>
          </div>
        </div>
        <div className='flex space-x-2'>
          {!currentFolder && (
            <Button
              onClick={handleCreateFolder}
              variant='outline'
              className='border-white/10 text-white bg-transparent'
            >
              <FolderPlus className='w-4 h-4' />
              New Folder
            </Button>
          )}
          {currentFolder && (
            <Button
              className='bg-purple-600 hover:bg-purple-700 text-white'
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className='w-4 h-4' />
              Upload Images
            </Button>
          )}
        </div>
      </div>

      {/* Upload section  */}
      {currentFolder && currentFolder.images.length === 0 && (
        <Card className='bg-black/40 border-white/10 border-dashed'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-white mb-2'>
                Upload Images to {currentFolder.name}
              </h3>
              <p className='text-gray-400 mb-4'>
                Drag and drop your images here, or click to browse
              </p>
              <Button
                variant='outline'
                className='border-white/10 text-white bg-transparent'
                onClick={() => setShowUploadModal(true)}
              >
                Choose Files
              </Button>
              <p className='text-xs text-gray-500 mt-2'>
                Supported formats: JPG, PNG, WebP. Max size: 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentFolder ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
          {currentFolder.images.map((image) => (
            <Card key={image._id} className='bg-black/40 border-white/10'>
              <CardContent className='p-4'>
                <img
                  src={image.url}
                  alt={image.name}
                  className='w-full h-60 object-cover rounded mb-2'
                />
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='font-medium text-white truncate max-w-[180px]'>
                      {image.name}
                    </h4>
                    <p className='text-xs text-gray-400'>
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-gray-400 hover:text-white'
                      >
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {/* <DropdownMenuItem>
                        <Eye className="w-4 h-4" />
                        View
                      </DropdownMenuItem> */}
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
            className='bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer'
            onClick={() => handleFolderClick(folder)}
          >
            <CardContent className='p-4'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <Folder className='w-8 h-8 text-purple-400' />
                    <div>
                      <h4 className='font-medium text-white truncate max-w-[110px]'>
                        {folder.name}
                      </h4>
                      <p className='text-sm text-gray-400'>
                        {folder.images.length} images
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-gray-400 hover:text-white'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => handleFolderClick(folder)}
                    >
                      <Eye className='w-4 h-4' />
                      Open
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
      {!currentFolder && folders?.length === 0 && (
        <Card className='bg-black/40 border-white/10 border-dashed'>
          <CardContent className='p-8 text-center'>
            <Folder className='w-12 h-12 mx-auto mb-4 text-gray-400' />
            <h3 className='text-lg font-medium text-white mb-2'>
              No Folders Yet
            </h3>
            <p className='text-gray-400 mb-4'>
              Create your first folder to organize your images
            </p>
            <Button
              onClick={handleCreateFolder}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <FolderPlus className='w-4 h-4' />
              Create Folder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Folder Modal */}
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

      {currentFolder && (
        <UploadModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          folderId={currentFolder._id}
          onUploadComplete={handleImageUploaded}
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
      />
    </div>
  );
}

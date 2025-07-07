"use client"

import {  useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Edit, Trash2, Eye, Folder, FolderPlus, ArrowLeft, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateFolderModal } from "../modals/folder-modal"
// import { useSession } from "next-auth/react"
import { useFolders } from "@/lib/hooks/useFolders"
import { UploadModal } from "../UploadModal"
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal"
import { useImage } from "@/lib/hooks/useImage"
import axios from "axios"

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
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const { deleteImage } = useImage();
  const [showUploadModal, setShowUploadModal] = useState(false);
   const [folderModalState, setFolderModalState] = useState({
    open: false,
    folderToEdit: null as { id: string; name: string } | null
  });
  
  const [deleteModalState, setDeleteModalState] = useState<{
  open: boolean;
  type?: 'folder' | 'image';
  id?: string;
   name?: string;
}>({ open: false });


const {
    folders,
    isLoading,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadImage
  } = useFolders();


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
        name: folderName 
      });
      setFolderModalState({ open: false, folderToEdit: null });
      
      if (currentFolder?._id === folderModalState.folderToEdit.id) {
        const updated = await getFolder.refetch();
        setCurrentFolder(updated.data);
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
      name: folder.name 
    } 
  });
  };


const handleDeleteConfirm = async () => {
  if (!deleteModalState.id) return;
  
  try {
    if (deleteModalState.type === 'folder') {
      await deleteFolder.mutateAsync(deleteModalState.id);
      setCurrentFolder(null); 
    } else if (deleteModalState.type === 'image') {
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
      await Promise.all(
        files.map(file => 
          uploadImage.mutateAsync({ 
            folderId: currentFolder._id.toString(),
            file 
          })
        )
      );
      const { data } = await axios.get(`/api/folders/${currentFolder._id}`);
      // const updated = await getFolder.refetch(currentFolder._id.toString());
      setCurrentFolder(data);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  

 if (isLoading) {
  return (
    <div className="space-y-6 mx-auto max-w-screen-lg py-10">
      <Skeleton className="h-10 w-1/3 rounded-lg" />
      <Skeleton className="h-6 w-1/2 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

  

  return (
    <div className="space-y-6 mx-auto max-w-screen-lg">
      {/* Header part */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentFolder && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolder(null)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentFolder ? currentFolder.name : "Image Gallery"}
            </h2>
            <p className="text-gray-400">
              {currentFolder
                ? `${currentFolder.imageCount} images in this folder`
                : "Manage your headshots and profile images"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {!currentFolder && (
            <Button
               onClick={handleCreateFolder}
              variant="outline"
              className="border-white/10 text-white bg-transparent"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          )}
          {currentFolder && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          )}
        </div>
      </div>

      {/* Upload section  */}
      {currentFolder && (
        <Card className="bg-black/40 border-white/10 border-dashed">
          <CardContent className="p-8">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Upload Images to {currentFolder.name}</h3>
              <p className="text-gray-400 mb-4">Drag and drop your images here, or click to browse</p>
              <Button variant="outline" className="border-white/10 text-white bg-transparent" onClick={() => setShowUploadModal(true)}>
                Choose Files
              </Button>
              <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, WebP. Max size: 10MB</p>
            </div>
          </CardContent>
        </Card>
      )}

       {currentFolder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {currentFolder.images.map((image) => (
            <Card key={image._id} className="bg-black/40 border-white/10">
              <CardContent className="p-4">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-60 object-cover rounded mb-2"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white truncate max-w-[180px]">{image.name}</h4>
                    <p className="text-xs text-gray-400">
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem> */}
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => {
                          setDeleteModalState({
                            open: true,
                            type: 'image',
                            id: image._id,
                            name: image.name,
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {folders?.map((folder) => (
            <Card
              key={folder._id}
              className="bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => {
                      setCurrentFolder({
                        ...folder,
                        _id: folder._id.toString(),
                        updatedAt: folder.updatedAt ?? new Date().toISOString(), 
                      });
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Folder className="w-8 h-8 text-purple-400" />
                      <div>
                        <h4 className="font-medium text-white truncate max-w-[110px]">{folder.name}</h4>
                        <p className="text-sm text-gray-400">{folder.images.length} images</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCurrentFolder(folder)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                         onClick={() => handleEditFolder({ id: folder._id.toString(), name: folder.name })}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                         onClick={() => {
                          setDeleteModalState({
                            open: true,
                            type: 'folder',
                            id: folder._id,
                            name: folder.name,
                          });
                        }}
                        className="text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-xs text-gray-500">
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      
      {/* Empty State */}
      {!currentFolder && folders?.length === 0 && (
        <Card className="bg-black/40 border-white/10 border-dashed">
          <CardContent className="p-8 text-center">
            <Folder className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">No Folders Yet</h3>
            <p className="text-gray-400 mb-4">Create your first folder to organize your images</p>
            <Button
              onClick={handleCreateFolder}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </CardContent>
        </Card>
      )}
  
       

      {/* Create Folder Modal */}
       <CreateFolderModal
        open={folderModalState.open}
        onOpenChange={(open) => setFolderModalState({ ...folderModalState, open })}
        onFolderCreated={folderModalState.folderToEdit ? handleFolderUpdated : handleFolderCreated}
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
        onOpenChange={(open) => setDeleteModalState({ ...deleteModalState, open })}
        onConfirm={handleDeleteConfirm}
        title={deleteModalState.name}
        type={deleteModalState.type || 'folder'}

      />
    </div>
  )
}

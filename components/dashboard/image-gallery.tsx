"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Edit, Trash2, Eye, Folder, FolderPlus, ArrowLeft, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateFolderModal } from "../modals/folder-modal"

const initialFolders = [
  {
    id: 1,
    name: "Professional Headshots",
    imageCount: 5,
    createdDate: "2024-01-15",
    images: [
      {
        id: 101,
        name: "Corporate Headshot 1",
        url: "/placeholder.svg?height=200&width=200",
        uploadDate: "2024-01-15",
        size: "2.3 MB",
        dimensions: "1200x1200",
      },
      {
        id: 102,
        name: "Corporate Headshot 2",
        url: "/placeholder.svg?height=200&width=200",
        uploadDate: "2024-01-14",
        size: "2.1 MB",
        dimensions: "1200x1200",
      },
    ],
  },
  {
    id: 2,
    name: "Casual Portraits",
    imageCount: 3,
    createdDate: "2024-01-10",
    images: [
      {
        id: 201,
        name: "Casual Portrait 1",
        url: "/placeholder.svg?height=200&width=200",
        uploadDate: "2024-01-10",
        size: "1.8 MB",
        dimensions: "1000x1000",
      },
    ],
  },
  {
    id: 3,
    name: "Speaking Photos",
    imageCount: 8,
    createdDate: "2024-01-08",
    images: [
      {
        id: 301,
        name: "Conference Speaking",
        url: "/placeholder.svg?height=200&width=200",
        uploadDate: "2024-01-08",
        size: "3.1 MB",
        dimensions: "1500x1000",
      },
    ],
  },
]

export function ImageGallery() {
  const [folders, setFolders] = useState(initialFolders)
  const [currentFolder, setCurrentFolder] = useState<any>(null)
  const [selectedImages] = useState<number[]>([])
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)

  const handleFolderCreated = (folderName: string) => {
    const newFolder = {
      id: Date.now(),
      name: folderName,
      imageCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
      images: [],
    }
    setFolders((prev) => [newFolder, ...prev])
  }

  const handleDeleteFolder = (folderId: number) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
  }

  const handleRenameFolder = (folderId: number, newName: string) => {
    setFolders((prev) => prev.map((folder) => (folder.id === folderId ? { ...folder, name: newName } : folder)))
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
              onClick={() => setShowCreateFolderModal(true)}
              variant="outline"
              className="border-white/10 text-white bg-transparent"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          )}
          {currentFolder && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
              <Button variant="outline" className="border-white/10 text-white bg-transparent">
                Choose Files
              </Button>
              <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, WebP. Max size: 10MB</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Folders Grid */}
      {!currentFolder && folders.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 cursor-pointer" onClick={() => setCurrentFolder(folder)}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Folder className="w-8 h-8 text-purple-400" />
                        <div>
                          <h4 className="font-medium text-white truncate max-w-[110px]">{folder.name}</h4>
                          <p className="text-sm text-gray-400">{folder.imageCount} images</p>
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
                          Open Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRenameFolder(folder.id, prompt("New name:") || folder.name)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)} className="text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created {new Date(folder.createdDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <Card className="bg-purple-600/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex space-x-2">
                {!currentFolder && (
                  <Button variant="outline" size="sm" className="border-white/10 text-white bg-transparent">
                    Move to Folder
                  </Button>
                )}
                <Button variant="outline" size="sm" className="border-white/10 text-white bg-transparent">
                  Download Selected
                </Button>
                <Button variant="destructive" size="sm">
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
       

      {/* Create Folder Modal */}
      <CreateFolderModal
        open={showCreateFolderModal}
        onOpenChange={setShowCreateFolderModal}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  )
}

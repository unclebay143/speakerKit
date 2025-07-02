"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

interface CreateFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFolderCreated?: (folderName: string) => void
}

export function CreateFolderModal({ open, onOpenChange, onFolderCreated }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useIsMobile()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onFolderCreated?.(folderName.trim())
      setFolderName("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating folder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFolderName("")
    onOpenChange(false)
  }

  if (isMobile) {
    return (
      <>
        {open && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/80 z-[100]" onClick={() => onOpenChange(false)} />
        )}
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="bg-black/95 border-white/10 z-[101]">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-white">Create New Folder</DrawerTitle>
              <DrawerDescription className="text-gray-400">Organize your images into folders</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName" className="text-white">
                    Folder Name
                  </Label>
                  <Input
                    id="folderName"
                    placeholder="e.g., Professional Headshots"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                    maxLength={50}
                    ref={inputRef}
                  />
                  <p className="text-xs text-gray-400">{folderName.length}/50 characters</p>
                </div>
              </form>
            </div>
            <DrawerFooter>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-white/10 text-white bg-transparent hover:bg-white/10"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!folderName.trim() || isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? "Creating..." : "Create Folder"}
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="border-white/10 text-white bg-transparent">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/80 z-[100]" onClick={() => onOpenChange(false)} />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-md z-[101]">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Folder</DialogTitle>
            <DialogDescription className="text-gray-400">Organize your images into folders</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folderName" className="text-white">
                  Folder Name
                </Label>
                <Input
                  id="folderName"
                  placeholder="e.g., Professional Headshots"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  required
                  maxLength={50}
                  ref={inputRef}
                />
                <p className="text-xs text-gray-400">{folderName.length}/50 characters</p>
              </div>
            </form>
          </div>
          <div className="mt-6 flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-white/10 text-white bg-transparent hover:bg-white/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!folderName.trim() || isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

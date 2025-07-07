"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

interface DeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  type?: 'profile' | 'folder' | 'image'
}

export function DeleteConfirmationModal({ 
  open, 
  onOpenChange, 
  onConfirm,
  title,
  description,
  type = 'profile'
}: DeleteConfirmationModalProps) {
  const isMobile = useIsMobile()

   const defaultDescriptions = {
    profile: title 
      ? `Are you sure you want to delete "${title}"?` 
      : "Are you sure you want to delete this profile?",
    folder: title
      ? `Are you sure you want to delete "${title}" and all its contents?`
      : "Are you sure you want to delete this folder and all its contents?",
    image: title
      ? `Are you sure you want to delete "${title}"?`
      : "Are you sure you want to delete this image?"
   }

   const modalTitle = {
    profile: "Delete Profile",
    folder: "Delete Folder",
    image: "Delete Image"
  }[type]

  const displayDescription = description || defaultDescriptions[type]

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {open && (
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => onOpenChange(false)} />
        )}
        <DrawerContent className="bg-black/95 border-white/10">
          <DrawerHeader>
            <DrawerTitle className="text-white">{modalTitle}</DrawerTitle>
            <DrawerDescription className="text-gray-400">
              {displayDescription}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <div className="flex space-x-3">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1 border-white/10 text-white bg-transparent hover:bg-white/10">
                  Cancel
                </Button>
              </DrawerClose>
              <Button 
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onConfirm()
                  onOpenChange(false)
                }}
              >
                Delete
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <>
   
      <Dialog open={open} onOpenChange={onOpenChange}>
        {open && (
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => onOpenChange(false)} />
        )}
        <DialogContent className="bg-black/95 border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">{modalTitle}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {displayDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white bg-transparent hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
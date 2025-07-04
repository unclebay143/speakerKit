"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

interface DeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  profileTitle?: string
}

export function DeleteConfirmationModal({ 
  open, 
  onOpenChange, 
  onConfirm,
  profileTitle 
}: DeleteConfirmationModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-black/95 border-white/10">
          <DrawerHeader>
            <DrawerTitle className="text-white">Delete Profile</DrawerTitle>
            <DrawerDescription className="text-gray-400">
              {profileTitle 
                ? `Are you sure you want to delete "${profileTitle}"?`
                : "Are you sure you want to delete this profile?"}
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            {profileTitle 
              ? `Are you sure you want to delete "${profileTitle}"?`
              : "Are you sure you want to delete this profile?"}
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
  )
}
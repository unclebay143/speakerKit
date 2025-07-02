"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, EyeOff } from "lucide-react"

interface CreateProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileCreated?: (profile: any) => void
}

export function CreateProfileModal({ open, onOpenChange, onProfileCreated }: CreateProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [profileData, setProfileData] = useState({
    title: "",
    type: "",
    shortBio: "",
    mediumBio: "",
    longBio: "",
  })
  const isMobile = useIsMobile()

  const handleInputChange = useCallback((field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (!profileData.title.trim() || !profileData.type) return

      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const newProfile = {
          id: Date.now(),
          title: profileData.title,
          type: profileData.type,
          bioLength: profileData.longBio ? "Long" : profileData.mediumBio ? "Medium" : "Short",
          lastUpdated: "Just now",
          isPublic,
          description: profileData.shortBio || "No description provided",
          shortBio: profileData.shortBio,
          mediumBio: profileData.mediumBio,
          longBio: profileData.longBio,
        }

        onProfileCreated?.(newProfile)

        setProfileData({
          title: "",
          type: "",
          shortBio: "",
          mediumBio: "",
          longBio: "",
        })
        setIsPublic(true)

        onOpenChange(false)
      } catch (error) {
        console.error("Error creating profile:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [profileData, isPublic, onProfileCreated, onOpenChange],
  )

  const handleCancel = useCallback(() => {
    setProfileData({
      title: "",
      type: "",
      shortBio: "",
      mediumBio: "",
      longBio: "",
    })
    setIsPublic(true)
    onOpenChange(false)
  }, [onOpenChange])

  if (isMobile) {
    return (
      <>
        {open && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/80 z-[100]" onClick={() => onOpenChange(false)} />
        )}
        <Drawer open={open} onOpenChange={onOpenChange} modal={true}>
          <DrawerContent className="bg-black/95 border-white/10 max-h-[90vh] z-[101] flex flex-col">
            <div className="overflow-y-auto px-4 pt-4 space-y-6 flex-1">
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-white">Create New Profile</DrawerTitle>
                <DrawerDescription className="text-gray-400">
                  Set up a new profile for different contexts
                </DrawerDescription>
              </DrawerHeader>
              {/* <ScrollArea className="px-4 flex-1"> */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Profile Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">
                        Profile Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Frontend Developer Profile"
                        value={profileData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>

                    {/* Bio Sections */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white text-sm font-medium">Biography Versions</Label>
                        <p className="text-xs text-gray-400 mb-3">
                          Create different Biography versions (short, medium or long)
                        </p>
                      </div>

                      {/* Short Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="shortBio" className="text-white text-sm">
                          Short Bio (200 characters max)
                        </Label>
                        <Textarea
                          id="shortBio"
                          placeholder="Brief introduction for quick references and social media"
                          value={profileData.shortBio}
                          onChange={(e) => handleInputChange("shortBio", e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[80px] resize-none"
                          maxLength={200}
                        />
                        <p className="text-xs text-gray-400 text-right">{profileData.shortBio.length}/200 characters</p>
                      </div>

                      {/* Medium Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="mediumBio" className="text-white text-sm">
                          Medium Bio (1500 characters max)
                        </Label>
                        <Textarea
                          id="mediumBio"
                          placeholder="Detailed bio for event programs and professional introductions"
                          value={profileData.mediumBio}
                          onChange={(e) => handleInputChange("mediumBio", e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[100px] resize-none"
                          maxLength={1500}
                        />
                        <p className="text-xs text-gray-400 text-right">{profileData.mediumBio.length}/1500 characters</p>
                      </div>

                      {/* Long Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="longBio" className="text-white text-sm">
                          Long Bio (Full biography, 3000 characters max)
                        </Label>
                        <Textarea
                          id="longBio"
                          placeholder="Complete biography with full background, achievements, and experience"
                          value={profileData.longBio}
                          onChange={(e) => handleInputChange("longBio", e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[120px] resize-none"
                          maxLength={3000}
                        />
                        <p className="text-xs text-gray-400 text-right">{profileData.longBio.length}/3000 characters</p>
                      </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        {isPublic ? (
                          <Eye className="w-5 h-5 text-green-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <Label className="text-white">Profile Visibility</Label>
                          <p className="text-sm text-gray-400">
                            {isPublic
                              ? "Public - Include this profile on your speaker page"
                              : "Private - Hide this profile from your speaker page"}
                          </p>
                        </div>
                      </div>
                      <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                    </div>
                  </div>
                </div>
              {/* </ScrollArea> */}
            </div>
           
            <DrawerFooter className="pt-4">
              <div className="flex space-x-3 w-full">
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
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!profileData.title.trim() || !profileData.type || isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? "Creating..." : "Create Profile"}
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
      <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-2xl max-h-[90vh] z-[101]">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Profile</DialogTitle>
            <DialogDescription className="text-gray-400">Set up a new profile for different contexts</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Profile Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Profile Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Frontend Developer Profile"
                    value={profileData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Bio Sections */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium">Biography</Label>
                    <p className="text-xs text-gray-400 mb-3">
                      Create different Biography versions (short, medium or long)
                    </p>
                  </div>

                  {/* Short Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="shortBio" className="text-white text-sm">
                      Short Bio (200 characters max)
                    </Label>
                    <Textarea
                      id="shortBio"
                      placeholder="Brief introduction for quick references and social media"
                      value={profileData.shortBio}
                      onChange={(e) => handleInputChange("shortBio", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[80px] resize-none"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-400 text-right">{profileData.shortBio.length}/200 characters</p>
                  </div>

                  {/* Medium Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="mediumBio" className="text-white text-sm">
                      Medium Bio (1500 characters max)
                    </Label>
                    <Textarea
                      id="mediumBio"
                      placeholder="Detailed bio for event programs and professional introductions"
                      value={profileData.mediumBio}
                      onChange={(e) => handleInputChange("mediumBio", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[100px] resize-none"
                      maxLength={1500}
                    />
                    <p className="text-xs text-gray-400 text-right">{profileData.mediumBio.length}/1500 characters</p>
                  </div>

                  {/* Long Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="longBio" className="text-white text-sm">
                      Long Bio (Full biography, 3000 characters max)
                    </Label>
                    <Textarea
                      id="longBio"
                      placeholder="Complete biography with full background, achievements, and experience"
                      value={profileData.longBio}
                      onChange={(e) => handleInputChange("longBio", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[120px] resize-none"
                      maxLength={3000}
                    />
                    <p className="text-xs text-gray-400 text-right">{profileData.longBio.length}/3000 characters</p>
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    {isPublic ? (
                      <Eye className="w-5 h-5 text-green-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <Label className="text-white">Profile Visibility</Label>
                      <p className="text-sm text-gray-400">
                        {isPublic
                          ? "Public - Include this profile on your speaker page"
                          : "Private - Hide this profile from your speaker page"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="mt-6">
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
                type="button"
                onClick={() => handleSubmit()}
                disabled={!profileData.title.trim() || !profileData.type || isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

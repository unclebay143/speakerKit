"use client"

import type React from "react"

import { useState } from "react"
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
import { Link, Check, AlertCircle } from "lucide-react"

interface UsernameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsernameModal({ open, onOpenChange }: UsernameModalProps) {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const isMobile = useIsMobile()

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null)
      return
    }

    setTimeout(() => {
      const unavailableUsernames = ["admin", "test", "user", "speaker", "demo"]
      setIsAvailable(!unavailableUsernames.includes(value.toLowerCase()))
    }, 500)
  }

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setUsername(sanitized)
    checkUsernameAvailability(sanitized)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !isAvailable) return

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
    }, 2000)
  }

  const profileUrl = `speakerkit.com/${username}`

  const ModalContent = () => (
    <>
      <div className="space-y-6">
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="e.g. Fashola-micheal"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                required
                minLength={3}
                maxLength={30}
              />
              {username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isAvailable === true && <Check className="w-4 h-4 text-green-400" />}
                  {isAvailable === false && <AlertCircle className="w-4 h-4 text-red-400" />}
                </div>
              )}
            </div>
            {username.length >= 3 && (
              <p
                className={`text-xs ${isAvailable === true ? "text-green-400" : isAvailable === false ? "text-red-400" : "text-gray-400"}`}
              >
                {isAvailable === true && "✓ Username is available"}
                {isAvailable === false && "✗ Username is already taken"}
                {isAvailable === null && "Checking availability..."}
              </p>
            )}
          </div>

          {username && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-2 text-sm">
                <Link className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">Your profile URL will be:</span>
              </div>
              <p className="text-purple-300 font-medium mt-1">{profileUrl}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Username must be 3-30 characters long</p>
            <p>• Only letters, numbers, and hyphens allowed</p>
            <p>• Cannot start or end with a hyphen</p>
          </div>
        </form>
      </div>
    </>
  )

  const ActionButtons = () => (
    <div className="flex space-x-3">
      <Button
        onClick={handleSubmit}
        disabled={!username || !isAvailable || isLoading}
        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? "Creating..." : "Create Profile"}
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-black/95 border-white/10">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-white">Set Up Your Profile</DrawerTitle>
            <DrawerDescription className="text-gray-400">
              Choose a unique username to create your profile URL. <br />
              Note: This will be used for for your public profile
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <ModalContent />
          </div>
          <DrawerFooter>
            <ActionButtons />
            <DrawerClose asChild>
              <Button variant="outline" className="border-white/10 text-white bg-transparent">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Set Up Your Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a unique username to create your profile URL, <br />
            Note:  This will be used for for your public profile
          </DialogDescription>
        </DialogHeader>
        <ModalContent />
        <div className="mt-6">
          <ActionButtons />
        </div>
      </DialogContent>
    </Dialog>
  )
}

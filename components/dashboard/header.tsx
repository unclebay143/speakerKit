"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu } from "lucide-react"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  mobileSidebarOpen: boolean
  activeTab: string
}

export function DashboardHeader({ 
  setMobileSidebarOpen, 
  activeTab 
}: HeaderProps) {    
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 lg:px-16 mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(true)}
            className="text-white hover:bg-white/10 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10 hidden lg:inline-flex"
          >
            <Menu className="w-5 h-5" />
          </Button>
           */}
          <div className="">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Manage your {activeTab === "images" ? "images" : "profile"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* {activeTab === "overview" && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Profile
            </Button>
          )}

          {activeTab === "images" && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Folder
            </Button>
          )} */}
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-purple-600 text-white">UA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
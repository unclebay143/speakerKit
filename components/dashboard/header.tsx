"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, PanelLeftOpen } from "lucide-react";
import { useSession } from "next-auth/react";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  mobileSidebarOpen: boolean;
  activeTab: string;
}

export function DashboardHeader({
  setMobileSidebarOpen,
  setSidebarOpen,
  sidebarOpen,
  activeTab,
}: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 mx-auto",
        sidebarOpen ? "lg:pr-16" : "lg:pl-16"
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setMobileSidebarOpen(true)}
            className='text-white hover:bg-white/10 lg:hidden'
          >
            <Menu className='w-5 h-5' />
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

          {sidebarOpen ? null : (
            <PanelLeftOpen
              className='w-4 h-4 ml-3 cursor-pointer'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          )}
          <div className='text-2xl font-bold text-white'>SpeakerKit</div>
          {/* <div className=''>
            <h1 className='text-2xl font-bold text-white'>Dashboard</h1>
            <p className='text-gray-400'>
              Manage your {activeTab === "images" ? "images" : "profile"}
            </p>
          </div> */}
        </div>

        <div className='flex items-center space-x-4'>
          {/* {activeTab === "overview" && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4" />
              New Profile
            </Button>
          )}

          {activeTab === "images" && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <FolderPlus className="w-4 h-4" />
              Add Folder
            </Button>
          )} */}
          <Avatar>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className='bg-purple-600 text-white'>
              {session?.user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

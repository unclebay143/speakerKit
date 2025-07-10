"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, PanelLeftOpen } from "lucide-react";
// import { useSession } from "next-auth/react";

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
  // const { data: session } = useSession();

  return (
    <header
      className={cn(
        "bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 mx-auto h-[74px] flex items-center",
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

          {sidebarOpen ? null : (
            <PanelLeftOpen
              className='w-4 h-4 ml-3 cursor-pointer'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          )}
          {/* <div className='text-2xl font-bold text-white'>SpeakerKit</div> */}
        </div>

        {/* <div className='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className='bg-purple-600 text-white'>
              {session?.user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div> */}
      </div>
    </header>
  );
}

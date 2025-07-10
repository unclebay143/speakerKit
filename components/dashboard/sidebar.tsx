"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRoundPen,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "images", label: "Image Gallery", icon: ImageIcon },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 
        transition-all duration-300 z-50 w-64
        lg:hidden
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between mb-8'>
            <Link href='/' className='flex items-center space-x-2'>
              <UserRoundPen className='w-8 h-8 text-purple-500' />
              <span className='text-white font-medium text-xl'>speakerKit</span>
            </Link>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setMobileSidebarOpen(false)}
              className='text-white hover:bg-white/10'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
          </div>

          <nav className='space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-white hover:bg-white/10 ${
                    activeTab === item.id
                      ? "bg-purple-600/20 text-purple-400"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                >
                  <Icon className='w-5 h-5' />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className='absolute bottom-4 left-4 right-4 space-y-2'>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className={`w-full justify-start text-white hover:bg-white/10 ${
              activeTab === "settings" ? "bg-purple-600/20 text-purple-400" : ""
            }`}
            onClick={() => {
              setActiveTab("settings");
              setMobileSidebarOpen(false);
            }}
          >
            <Settings className='w-5 h-5' />
            <span>Settings</span>
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-red-400 hover:bg-red-500/10'
          >
            <LogOut className='w-5 h-5' />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 
        transition-all duration-300 z-50 
        ${isOpen ? "w-64" : "w-16"}
        hidden lg:block
      `}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between mb-8'>
            <Link
              href='/'
              className={`flex items-center space-x-2 ${
                !isOpen && "justify-center"
              }`}
            >
              <UserRoundPen className='w-8 h-8 text-purple-500' />
              {isOpen && (
                <span className='text-white font-medium text-xl'>
                  speakerKit
                </span>
              )}
            </Link>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(!isOpen)}
              className='text-white hover:bg-white/10'
            >
              {isOpen ? (
                <ChevronLeft className='w-4 h-4' />
              ) : (
                <ChevronRight className='w-4 h-4' />
              )}
            </Button>
          </div>

          <nav className='space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-white hover:bg-white/10 ${
                    activeTab === item.id
                      ? "bg-purple-600/20 text-purple-400"
                      : ""
                  } ${!isOpen && "px-2"}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className='w-5 h-5' />
                  {isOpen && <span>{item.label}</span>}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className='absolute bottom-4 left-4 right-4 space-y-2'>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className={`w-full justify-start text-white hover:bg-white/10 ${
              activeTab === "settings" ? "bg-purple-600/20 text-purple-400" : ""
            } ${!isOpen && "px-2"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className='w-5 h-5' />
            {isOpen && <span>Settings</span>}
          </Button>
          <Button
            variant='ghost'
            className={`w-full justify-start text-red-400 hover:bg-red-500/10 ${
              !isOpen && "px-2"
            }`}
          >
            <LogOut className='w-5 h-5' />
            {isOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
}

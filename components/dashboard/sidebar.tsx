"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CreditCard,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  Settings,
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

const menuItems = [
  { slug: "overview", label: "Overview", icon: LayoutDashboard },
  { slug: "gallery", label: "Gallery", icon: ImageIcon },
  { slug: "events", label: "Events", icon: Calendar },
  { slug: "settings", label: "Settings", icon: Settings },
];

function SidebarNavSection({
  activeTab,
  // setActiveTab,
  isOpen,
  setIsOpen,
  mobile,
  setMobileSidebarOpen,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  mobile?: boolean;
  setMobileSidebarOpen?: (open: boolean) => void;
}) {
  const { data: user } = useCurrentUser();

  return (
    <>
      <div
        className={cn(
          "flex items-center",
          mobile
            ? "justify-between mb-10"
            : isOpen
            ? "mb-10 px-4 justify-between"
            : "mb-10 justify-center"
        )}
      >
        <Avatar>
          <AvatarImage
            src={
              user?.image ||
              `https://api.dicebear.com/9.x/micah/svg?seed=${user?.slug}`
            }
          />
          <AvatarFallback className='bg-gray-100 dark:bg-gray-700' />
        </Avatar>
        {mobile ? (
          <PanelLeftClose
            className='w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400'
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          />
        ) : isOpen && setIsOpen ? (
          <PanelLeftClose
            className='w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400'
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : null}
      </div>
      <nav className={cn("space-y-2", mobile ? "" : "px-4")}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.slug}
              variant={activeTab === item.slug ? "secondary" : "ghost"}
              className={`w-full justify-start text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
                activeTab === item.slug
                  ? "bg-purple-600/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400"
                  : ""
              } ${!isOpen && !mobile ? "px-2" : ""}`}
              asChild
            >
              <Link href={`/${item.slug}`}>
                <Icon className='w-5 h-5' />
                {(isOpen || mobile) && <span>{item.label}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>
    </>
  );
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: SidebarProps) {
  // Backdrop for mobile
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/10
        transition-all duration-300 z-30 w-64
        lg:hidden
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className='p-4'>
          <SidebarNavSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mobile
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
          <div className='absolute bottom-4 left-4 right-4 space-y-2'>
            <Button
              variant={activeTab === "billing" ? "secondary" : "ghost"}
              className={`w-full justify-start text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
                activeTab === "billing"
                  ? "bg-purple-600/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400"
                  : ""
              }`}
              onClick={() => {
                setActiveTab("billing");
                setMobileSidebarOpen(false);
              }}
            >
              <Link href='/billing' className='flex items-center gap-2'>
                <CreditCard className='w-5 h-5' />
                <span>Billing</span>
              </Link>
            </Button>
            <Button
              variant='ghost'
              className='w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
            >
              <LogOut className='w-5 h-5' />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden'
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      {/* Desktop Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/10
        transition-all duration-300 z-20 
        ${isOpen ? "w-64" : "w-16"}
        hidden lg:block
      `}
      >
        <div className='py-4'>
          <SidebarNavSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
        <div className='absolute bottom-4 left-4 right-4 space-y-2'>
          <Button
            variant='ghost'
            className={`w-full justify-start text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
              activeTab === "billing"
                ? "bg-purple-600/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400"
                : ""
            } ${!isOpen ? "px-2" : ""}`}
            asChild
          >
            <Link href='/billing'>
              <CreditCard className='w-5 h-5' />
              {isOpen && <span>Billing</span>}
            </Link>
          </Button>
          <Button
            variant='ghost'
            className={`w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 ${
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

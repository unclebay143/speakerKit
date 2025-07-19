"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { Check, Copy, Menu, Moon, PanelLeftOpen, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  const { data: user } = useCurrentUser();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("speakerkit-theme", !isDark ? "dark" : "light");
  };

  const handleCopyProfileUrl = async () => {
    const url = `${window.location.origin}/@${user?.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Profile URL copied!",
        description: url,
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy URL",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header
      className={cn(
        "bg-white/80 dark:bg-black/20 backdrop-blur-sm border-b border-gray-200 dark:border-white/10",
        "p-4 mx-auto h-[74px] flex items-center",
        sidebarOpen ? "lg:pr-16" : "lg:pl-16"
      )}
    >
      <div className='w-full flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setMobileSidebarOpen(true)}
            className={cn(
              "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10",
              "lg:hidden"
            )}
          >
            <Menu className='w-5 h-5' />
          </Button>

          {sidebarOpen ? null : (
            <PanelLeftOpen
              className='w-4 h-4 ml-3 cursor-pointer text-gray-500 dark:text-gray-400'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          )}
        </div>

        <div className='flex items-center space-x-4'>
          {user?.slug && (
            <div className='flex rounded-md overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40'>
              <Link
                href={`/@${user.slug}`}
                target='_blank'
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:bg-gray-100 dark:focus:bg-white/10 border-r border-gray-200 dark:border-white/10 flex items-center'
                style={{ textDecoration: "none" }}
              >
                View Profile
              </Link>
              <button
                onClick={handleCopyProfileUrl}
                className={cn(
                  "px-3 py-2 flex items-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none transition-colors",
                  copied &&
                    "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                )}
                title={copied ? "Copied!" : "Copy profile URL"}
                type='button'
              >
                {copied ? (
                  <Check className='w-4 h-4' />
                ) : (
                  <Copy className='w-4 h-4' />
                )}
              </button>
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            onClick={toggleTheme}
            className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
          >
            <Moon className='w-5 h-5 dark:hidden' />
            <Sun className='w-5 h-5 hidden dark:block' />
          </Button>
        </div>
      </div>
    </header>
  );
}

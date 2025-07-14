"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { UsernameModal } from "../modals/username-modal";
import { Spinner } from "../ui/spinner";
import { DashboardHeader } from "./header";
import { DashboardSidebar } from "./sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const { data: session, status, update } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [, setUpdatingSession] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.startsWith("/gallery")) return "gallery";
    if (pathname.startsWith("/settings")) return "settings";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "overview":
        router.push("/overview");
        break;
      case "gallery":
        router.push("/gallery");
        break;
      case "settings":
        router.push("/settings");
        break;
    }
    setMobileSidebarOpen(false);
  };

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     setShowUsernameModal(!session?.user?.username);
  //   }
  // }, [status, session]);

  // Handle theme persistence and system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("speakerkit-theme");
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark"
        );
      } else {
        // Check system preference if no saved theme
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.toggle("dark", prefersDark);
        localStorage.setItem(
          "speakerkit-theme",
          prefersDark ? "dark" : "light"
        );
      }

      // Listen for system theme changes (only if no user preference is saved)
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const savedTheme = localStorage.getItem("speakerkit-theme");
        if (!savedTheme) {
          document.documentElement.classList.toggle("dark", e.matches);
          localStorage.setItem(
            "speakerkit-theme",
            e.matches ? "dark" : "light"
          );
        }
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, []);

  const handleUsernameComplete = async () => {
    setUpdatingSession(true);
    try {
      await update();
    } finally {
      setUpdatingSession(false);
      setShowUsernameModal(false);
    }
  };

  if (status === "loading") {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-black/[0.96] flex items-center justify-center'>
        <Spinner className='bg-purple-600 dark:bg-purple-400' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black/[0.96] text-gray-900 dark:text-white'>
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <div
        className={`
        flex-1 transition-all duration-300 
        ${sidebarOpen ? "xl:ml-64" : "md:ml-1"}
      `}
      >
        <DashboardHeader
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        <main className='p-6'>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      {/* {showUsernameModal && (
        <UsernameModal
          open={showUsernameModal}
          onOpenChange={(open) => !open && setShowUsernameModal(false)}
          onComplete={handleUsernameComplete}
        />
      )} */}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { UsernameModal } from "../modals/username-modal";
import { Spinner } from "../ui/spinner";
import { DashboardHeader } from "./header";
import { ImageGallery } from "./image-gallery";
import { ProfilesOverview } from "./profile-overview";
import { Settings } from "./settings";
import { DashboardSidebar } from "./sidebar";

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  // const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [, setUpdatingSession] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "overview";
    }
    return "overview";
  });

  useEffect(() => {
    if (status === "authenticated") {
      setShowUsernameModal(!session?.user?.username);
    }
  }, [status, session]);

  // console.log("Session after update:", session)

  const handleUsernameComplete = async () => {
    setUpdatingSession(true);
    try {
      await update();
    } finally {
      setUpdatingSession(false);
      setShowUsernameModal(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  if (status === "loading") {
    return (
      <div className='min-h-screen bg-black/[0.96] flex items-center justify-center'>
        <Spinner className='bg-purple-600' />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfilesOverview />;
      case "images":
        return <ImageGallery />;
      case "settings":
        return <Settings />;
      default:
        return <ProfilesOverview />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className='min-h-screen bg-black/[0.96] text-white'>
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
        ${sidebarOpen ? "md:ml-64" : "md:ml-1"}
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
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
      {showUsernameModal && (
        <UsernameModal
          open={showUsernameModal}
          onOpenChange={(open) => !open && setShowUsernameModal(false)}
          onComplete={handleUsernameComplete}
        />
      )}
    </div>
  );
}

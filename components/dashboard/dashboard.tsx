"use client"

import {  useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { ProfilesOverview } from "./profile-overview"
import { UsernameModal } from "../modals/username-modal"
import { ImageGallery } from "./image-gallery"
import { Settings } from "./settings"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { data: session, status, update } = useSession()
  // const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [, setUpdatingSession] = useState(false);


  
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeTab') || "overview"
    }
    return "overview"
  })

  useEffect(() => {
    if (status === "authenticated") {
      setShowUsernameModal(!session?.user?.username);
    }
  }, [status, session]);

  //   useEffect(() => {
  //   if (status === "authenticated" && session?.user) {
  //     if (!session.user.username) {
  //       setShowUsernameModal(true);
  //     } else {
  //       setShowUsernameModal(false);
  //     }
  //   }
  // }, [status, session?.user?.username]);


  console.log("Session after update:", session)


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
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab)
    }
  }, [activeTab])

  if (status === "loading") {
    return <div className="min-h-screen bg-black/[0.96] flex items-center justify-center">
      Loading session...
    </div>;
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfilesOverview  />
      case "images":
        return <ImageGallery />
      case "settings":
        return <Settings />
      default:
        return <ProfilesOverview />
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileSidebarOpen(false)
  }


  return (
    <div className="min-h-screen bg-black/[0.96] text-white">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <div className={`
        flex-1 transition-all duration-300 
        ${sidebarOpen ? "md:ml-64" : "md:ml-1"}
      `}>
        <DashboardHeader 
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen} 
          sidebarOpen={sidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        <main className="p-6">
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
  )
}
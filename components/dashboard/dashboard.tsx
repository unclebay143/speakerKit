"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { ProfilesOverview } from "./profile-overview"
import { UsernameModal } from "../modals/username-modal"
import { ImageGallery } from "./image-gallery"
import { Settings } from "./settings"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfilesOverview />
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
      <UsernameModal open={showUsernameModal} onOpenChange={setShowUsernameModal}/>
    </div>
  )
}
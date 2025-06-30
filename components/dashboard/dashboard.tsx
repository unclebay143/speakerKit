"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { ProfilesOverview } from "./profile-overview"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfilesOverview />
      case "editor":
        // return <ProfileEditor />
      case "images":
        // return <ImageGallery />
      
      default:
        return <ProfilesOverview />
    }
  }

  return (
    <div className="min-h-screen bg-black/[0.96] text-white">
      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
          <DashboardHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

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
      </div>
    </div>
  )
}

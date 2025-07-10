"use client";

"use client";
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { UsernameModal } from "../modals/username-modal";
import { DashboardHeader } from "./header";
import { DashboardSidebar } from "./sidebar";
import { Spinner } from '../ui/spinner';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardProps {
  children: React.ReactNode; 
}

export default function Dashboard({ children }: DashboardProps) {
  const { data: session, status, update } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [, setUpdatingSession] = useState(false);
   const router = useRouter();
  const pathname = usePathname();

   const getActiveTab = () => {
    if (pathname.startsWith('/gallery')) return 'images';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'overview':
        router.push('/dashboard');
        break;
      case 'images':
        router.push('/gallery');
        break;
      case 'settings':
        router.push('/settings');
        break;
    }
    setMobileSidebarOpen(false);
  };

 useEffect(() => {
    if (status === "authenticated") {
      setShowUsernameModal(!session?.user?.username);
    }
  }, [status, session]);

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
      <div className='min-h-screen bg-black/[0.96] flex items-center justify-center'>
        <Spinner className='bg-purple-600' />
      </div>
    );
  }



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
            // key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
            {/* {renderContent()} */}
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

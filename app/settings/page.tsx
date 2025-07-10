import Dashboard from '@/components/dashboard/dashboard';
import { Settings } from '@/components/dashboard/settings'
import { authOptions } from '@/utils/auth-options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }
    
  return (
   <Dashboard>
    <Settings/>
    </Dashboard>
  )
}


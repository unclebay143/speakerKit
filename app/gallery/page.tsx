import { ImageGallery } from '@/components/dashboard/image-gallery'

import React from 'react'
import Dashboard from '@/components/dashboard/dashboard'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import { redirect } from 'next/navigation';



export default async function GalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  
  return (
    <Dashboard>
      <ImageGallery />
    </Dashboard>
  );
}


"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";

interface Profile {
  _id: string;
  title: string;
  shortBio: string;
  mediumBio?: string;
  longBio?: string;
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
}

interface Folder {
  _id: string;
  name: string;
  description: string;
  images: {
    _id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

interface UserData {
  name: string;
  email: string;
  image: string;
  location: string;
  createdAt: string;
  website: string;
  country: string;
}

interface Template1Props {
  userData: UserData;
  profiles: Profile[];
  folders: Folder[];
  activeProfile: string;
  setActiveProfile: (id: string) => void;
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
}

export default function Template1({
  userData,
  profiles,
  folders,
  activeProfile,
  setActiveProfile,
  selectedFolder,
  setSelectedFolder,
}: Template1Props) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);

  const getActiveProfile = () => {
    if (!profiles || profiles.length === 0) return null;
    const publicProfiles = profiles.filter((profile) => profile.isPublic);
    return (
      publicProfiles.find((profile) => profile._id === activeProfile) ||
      profiles[0]
    );
  };

  const getSelectedFolder = () => {
    return folders.find((folder) => folder._id === selectedFolder);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      setDownloadingImage(imageName);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image: ", err);
    } finally {
      setDownloadingImage(null);
    }
  };

  const CopyButton = ({
    text,
    type,
    label,
  }: {
    text: string;
    type: string;
    label: string;
  }) => (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => copyToClipboard(text, type)}
      className='h-8 px-2 text-xs'
    >
      {copiedText === type ? (
        <Check className='h-3 w-3 mr-1' />
      ) : (
        <Copy className='h-3 w-3 mr-1' />
      )}
      {copiedText === type ? "Copied!" : label}
    </Button>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='max-w-6xl mx-auto py-8 px-4'>
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className='bg-white shadow-lg border-0 rounded-2xl overflow-hidden'>
            <CardContent className='p-8'>
              <div className='flex flex-col md:flex-row gap-8'>
                {/* Profile Image */}
                <div className='flex-shrink-0'>
                  <Avatar className='h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg'>
                    <AvatarImage
                      src={userData?.image || "/placeholder-user.jpg"}
                      className='object-cover'
                    />
                    <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-medium'>
                      {userData?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className='flex-1 space-y-4'>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                      {userData?.name || "Speaker"}
                    </h1>
                    {getActiveProfile() && (
                      <h2 className='text-xl text-gray-600 font-medium'>
                        {getActiveProfile()?.title}
                      </h2>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                    {userData?.location && (
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-blue-500' />
                        <span>{userData?.location}</span>
                      </div>
                    )}
                    {userData?.email && (
                      <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4 text-blue-500' />
                        <a
                          href={`mailto:${userData?.email}`}
                          className='hover:text-blue-600 transition-colors'
                        >
                          {userData?.email}
                        </a>
                      </div>
                    )}
                    {userData?.website && (
                      <div className='flex items-center gap-2'>
                        <Globe className='h-4 w-4 text-blue-500' />
                        <a
                          href={userData?.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:text-blue-600 transition-colors'
                        >
                          {userData?.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className='flex gap-3'>
                    <button
                      className='rounded-full p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black'
                      aria-label='LinkedIn'
                    >
                      <Linkedin className='h-4 w-4' />
                    </button>
                    <button
                      className='rounded-full p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black'
                      aria-label='Twitter'
                    >
                      <Twitter className='h-4 w-4' />
                    </button>
                    <button
                      className='rounded-full p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black'
                      aria-label='Instagram'
                    >
                      <Instagram className='h-4 w-4' />
                    </button>
                    <button
                      className='rounded-full p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black'
                      aria-label='Phone'
                    >
                      <Phone className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bio Sections */}
        {profiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='mt-8 space-y-6'
          >
            {/* Profile Selector */}
            <div className='flex flex-wrap gap-2'>
              {profiles.map((profile) => (
                <button
                  key={profile._id}
                  type='button'
                  onClick={() => setActiveProfile(profile._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                    ${
                      activeProfile === profile._id
                        ? "bg-gray-600 text-white shadow"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-400`}
                  aria-pressed={activeProfile === profile._id}
                >
                  {profile.title}
                </button>
              ))}
            </div>

            {/* Bio Content */}
            <Card className='bg-white shadow-lg border-0 rounded-2xl'>
              <CardHeader className='pb-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    {getActiveProfile()?.title || "Profile"}
                  </h3>
                  {getActiveProfile()?.isPublic && (
                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                      Public Profile
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Short Bio */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      Short Biography
                    </h4>
                    <CopyButton
                      text={getActiveProfile()?.shortBio || ""}
                      type='short'
                      label='Copy Short Bio'
                    />
                  </div>
                  <p className='text-gray-700 leading-relaxed'>
                    {getActiveProfile()?.shortBio ||
                      "No short biography available."}
                  </p>
                </div>

                {/* Medium Bio */}
                {getActiveProfile()?.mediumBio && (
                  <div className='space-y-3 pt-4 border-t border-gray-100'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        Medium Biography
                      </h4>
                      <CopyButton
                        text={getActiveProfile()?.mediumBio || ""}
                        type='medium'
                        label='Copy Medium Bio'
                      />
                    </div>
                    <p className='text-gray-700 leading-relaxed'>
                      {getActiveProfile()?.mediumBio}
                    </p>
                  </div>
                )}

                {/* Long Bio */}
                {getActiveProfile()?.longBio && (
                  <div className='space-y-3 pt-4 border-t border-gray-100'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        Full Biography
                      </h4>
                      <CopyButton
                        text={getActiveProfile()?.longBio || ""}
                        type='long'
                        label='Copy Full Bio'
                      />
                    </div>
                    <p className='text-gray-700 leading-relaxed'>
                      {getActiveProfile()?.longBio}
                    </p>
                  </div>
                )}

                <div className='pt-4 border-t border-gray-100 text-sm text-gray-500'>
                  Last updated{" "}
                  {getActiveProfile()?.updatedAt
                    ? format(
                        new Date(getActiveProfile()?.updatedAt || ""),
                        "MMMM d, yyyy"
                      )
                    : "Date not available"}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Image Galleries */}
        {folders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mt-8 space-y-6'
          >
            <h3 className='text-2xl font-bold text-gray-900'>
              Image Galleries
            </h3>

            {/* Folders Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {folders.map((folder) => (
                <Card
                  key={folder._id}
                  className={`bg-white shadow-lg border-0 rounded-xl cursor-pointer transition-all hover:shadow-xl ${
                    selectedFolder === folder._id
                      ? "ring-2 ring-blue-500 grayscale-0"
                      : "grayscale"
                  }`}
                  onClick={() =>
                    setSelectedFolder(
                      selectedFolder === folder._id ? null : folder._id
                    )
                  }
                >
                  {/* Image Grid Cover */}
                  <div className='relative w-full h-96 overflow-hidden rounded-t-xl'>
                    {folder.images.length > 0 ? (
                      <div className='w-full h-full'>
                        {folder.images.length === 1 ? (
                          <img
                            src={folder.images[0].url}
                            alt={folder.images[0].name}
                            className='w-full h-full object-cover'
                          />
                        ) : folder.images.length === 2 ? (
                          <div className='grid grid-cols-2 h-full'>
                            {folder.images.slice(0, 2).map((image) => (
                              <img
                                key={image._id}
                                src={image.url}
                                alt={image.name}
                                className='w-full h-full object-cover'
                              />
                            ))}
                          </div>
                        ) : folder.images.length === 3 ? (
                          <div className='grid grid-cols-2 h-full'>
                            <img
                              src={folder.images[0].url}
                              alt={folder.images[0].name}
                              className='w-full h-full object-cover'
                            />
                            <div className='grid grid-rows-2'>
                              {folder.images.slice(1, 3).map((image) => (
                                <img
                                  key={image._id}
                                  src={image.url}
                                  alt={image.name}
                                  className='w-full h-full object-cover'
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className='grid grid-cols-2 grid-rows-2 h-full'>
                            {folder.images.slice(0, 4).map((image) => (
                              <img
                                key={image._id}
                                src={image.url}
                                alt={image.name}
                                className='w-full h-full object-cover'
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                        <span className='text-gray-400'>No images</span>
                      </div>
                    )}
                    <div className='absolute top-2 right-2'>
                      <Badge className='bg-black/70 text-white'>
                        {folder.images.length} photos
                      </Badge>
                    </div>
                  </div>
                  {/* Card Content always visible below image grid */}
                  <CardContent className='p-4'>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      {folder.name}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {folder.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Folder Images */}
            {selectedFolder && getSelectedFolder() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='mt-8'
              >
                <div className='flex items-center justify-between mb-6'>
                  <h4 className='text-xl font-semibold text-gray-900'>
                    {getSelectedFolder()?.name} (
                    {getSelectedFolder()?.images.length} photos)
                  </h4>
                  {/* <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSelectedFolder(null)}
                  >
                    Close Gallery
                  </Button> */}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {getSelectedFolder()?.images.map((image) => (
                    <div key={image._id} className='relative group'>
                      <img
                        src={image.url}
                        alt={image.name}
                        className='w-full h-[32rem] object-cover rounded-lg'
                      />
                      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg'>
                        <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Button
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(image.url, image.name);
                            }}
                            disabled={downloadingImage === image.name}
                            className='bg-white/90 text-gray-900 hover:bg-white'
                          >
                            {downloadingImage === image.name ? (
                              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent' />
                            ) : (
                              <Download className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

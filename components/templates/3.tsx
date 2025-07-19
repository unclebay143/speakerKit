"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Calendar,
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

interface Template2Props {
  userData: UserData;
  profiles: Profile[];
  folders: Folder[];
  activeProfile: string;
  setActiveProfile: (id: string) => void;
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
}

export default function Template2({
  userData,
  profiles,
  folders,
  activeProfile,
  setActiveProfile,
  selectedFolder,
  setSelectedFolder,
}: Template2Props) {
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
    <button
      onClick={() => copyToClipboard(text, type)}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition
        ${
          copiedText === type
            ? "bg-teal-600 text-white"
            : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
        }
        focus:outline-none focus:ring-2 focus:ring-teal-400`}
      aria-pressed={copiedText === type}
    >
      {copiedText === type ? (
        <Check className='h-3 w-3' />
      ) : (
        <Copy className='h-3 w-3' />
      )}
      {copiedText === type ? "Copied!" : label}
    </button>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-teal-50 flex flex-col md:flex-row'>
      <div className='max-w-6xl mx-auto flex-1 flex flex-col md:flex-row px-4 py-10 gap-10'>
        {/* Left: Profile & Quick Info (sticky on desktop) */}
        <div className='hidden md:flex flex-col items-center md:items-start gap-8 w-1/3 sticky top-0 h-screen overflow-y-auto pr-8'>
          {/* Hero Profile Image */}
          <div className='relative'>
            <div className='w-40 h-40 rounded-full bg-gradient-to-tr from-teal-400 to-teal-200 p-1 shadow-lg'>
              <img
                src={userData.image || "/placeholder-user.jpg"}
                alt={userData.name}
                className='w-full h-full object-cover rounded-full border-4 border-white'
              />
            </div>
            {getActiveProfile()?.isPublic && (
              <span className='absolute bottom-2 right-2 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow'>
                <BadgeCheck className='h-4 w-4' /> Public
              </span>
            )}
          </div>
          {/* Name & Title */}
          <div className='text-center md:text-left'>
            <h1 className='text-2xl font-bold text-gray-900 mb-1'>
              {userData.name}
            </h1>
            <h2 className='text-lg text-teal-700 font-medium'>
              {getActiveProfile()?.title}
            </h2>
          </div>
          {/* Contact Info */}
          <div className='flex flex-col gap-2 text-sm text-gray-700 w-full'>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-teal-500' />
              <span>{userData.email}</span>
            </div>
            {userData.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-teal-500' />
                <span>{userData.location || "Location not specified"}</span>
              </div>
            )}
            {userData.website && (
              <div className='flex items-center gap-2'>
                <Globe className='h-4 w-4 text-teal-500' />
                {userData.website ? (
                  <a
                    href={userData.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline text-teal-700'
                  >
                    {userData.website}
                  </a>
                ) : null}
              </div>
            )}
            {userData.createdAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-teal-500' />
                <span>
                  Joined{" "}
                  {userData.createdAt
                    ? format(new Date(userData.createdAt), "MMMM d, yyyy")
                    : "Date not available"}
                </span>
              </div>
            )}
            {userData.country && (
              <div className='flex items-center gap-2'>
                <span className='text-teal-500'>•</span>
                <span>{userData.country || "Country not specified"}</span>
              </div>
            )}
          </div>
          {/* Social Links */}
          <div className='flex gap-3 mt-2'>
            <button
              className='rounded-full p-2 border border-teal-600 bg-white text-teal-700 hover:bg-teal-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-teal-400'
              aria-label='LinkedIn'
            >
              <Linkedin className='h-4 w-4' />
            </button>
            <button
              className='rounded-full p-2 border border-teal-600 bg-white text-teal-700 hover:bg-teal-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-teal-400'
              aria-label='Twitter'
            >
              <Twitter className='h-4 w-4' />
            </button>
            <button
              className='rounded-full p-2 border border-teal-600 bg-white text-teal-700 hover:bg-teal-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-teal-400'
              aria-label='Instagram'
            >
              <Instagram className='h-4 w-4' />
            </button>
            <button
              className='rounded-full p-2 border border-teal-600 bg-white text-teal-700 hover:bg-teal-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-teal-400'
              aria-label='Phone'
            >
              <Phone className='h-4 w-4' />
            </button>
          </div>
          {/* Profile Selector */}
          <div className='flex flex-wrap gap-2 mt-4'>
            {profiles.map((profile) => (
              <button
                key={profile._id}
                type='button'
                onClick={() => setActiveProfile(profile._id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                    ${
                      activeProfile === profile._id
                        ? "bg-teal-600 text-white shadow"
                        : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-teal-400`}
                aria-pressed={activeProfile === profile._id}
              >
                {profile.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Bio & Gallery (scrollable) */}
        <ScrollArea className='flex-1 flex flex-col gap-8 h-screen'>
          {/* Bio Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Short Bio */}
            <div className='bg-white rounded-xl shadow p-6 flex flex-col gap-3 border-t-4 border-teal-400 h-52'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold text-gray-900'>Quick Bio</h3>
                <CopyButton
                  text={getActiveProfile()?.shortBio || ""}
                  type='short'
                  label='Copy'
                />
              </div>
              <ScrollArea className='flex-1 min-h-0 h-28'>
                <p className='text-gray-700 leading-relaxed pr-1'>
                  {getActiveProfile()?.shortBio ||
                    "No short biography available."}
                </p>
              </ScrollArea>
            </div>
            {/* Medium Bio */}
            {getActiveProfile()?.mediumBio && (
              <div className='bg-white rounded-xl shadow p-6 flex flex-col gap-3 border-t-4 border-teal-400 h-52'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-900'>
                    Medium Bio
                  </h3>
                  <CopyButton
                    text={getActiveProfile()?.mediumBio || ""}
                    type='medium'
                    label='Copy'
                  />
                </div>
                <ScrollArea className='flex-1 min-h-0 h-28'>
                  <p className='text-gray-700 leading-relaxed pr-1'>
                    {getActiveProfile()?.mediumBio}
                  </p>
                </ScrollArea>
              </div>
            )}
            {/* Long Bio */}
            {getActiveProfile()?.longBio && (
              <div className='bg-white rounded-xl shadow p-6 flex flex-col gap-3 border-t-4 border-teal-400 md:col-span-2 h-72'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-900'>
                    Full Biography
                  </h3>
                  <CopyButton
                    text={getActiveProfile()?.longBio || ""}
                    type='long'
                    label='Copy'
                  />
                </div>
                <ScrollArea className='flex-1 min-h-0 h-28'>
                  <p className='text-gray-700 leading-relaxed pr-1'>
                    {getActiveProfile()?.longBio}
                  </p>
                </ScrollArea>
              </div>
            )}
          </div>
          {/* Gallery */}
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Image Galleries
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {folders.map((folder) => (
                <div
                  key={folder._id}
                  className={`rounded-xl transition-all cursor-pointer mb-2 
                      ${
                        selectedFolder === folder._id
                          ? "border-2 border-teal-500 grayscale-0"
                          : "grayscale border border-gray-200"
                      }
                      bg-white shadow hover:shadow-lg`}
                  onClick={() =>
                    setSelectedFolder(
                      selectedFolder === folder._id ? null : folder._id
                    )
                  }
                >
                  {/* Image Grid Cover */}
                  <div className='relative w-full h-40 overflow-hidden rounded-t-xl'>
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
                      <span className='px-3 py-1 rounded-full text-xs font-semibold shadow bg-black/70 text-white'>
                        {folder.images.length} photos
                      </span>
                    </div>
                  </div>
                  {/* Card Content always visible below image grid */}
                  <div className='p-4'>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      {folder.name}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {folder.description}
                    </p>
                  </div>
                </div>
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
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {getSelectedFolder()?.images.map((image) => (
                    <div
                      key={image._id}
                      className='relative group rounded-lg overflow-hidden'
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className='w-full h-64 object-cover'
                      />
                      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg'>
                        <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(image.url, image.name);
                            }}
                            disabled={downloadingImage === image.name}
                            className='bg-white/90 text-gray-900 hover:bg-white rounded-full p-2 shadow'
                          >
                            {downloadingImage === image.name ? (
                              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent' />
                            ) : (
                              <Download className='h-4 w-4' />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

"use client";

import {
  BadgeCheck,
  Check,
  Copy,
  Download,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { useState } from "react";

interface Profile {
  _id: string;
  title: string;
  shortBio: string;
  mediumBio?: string;
  longBio?: string;
  isVerified: boolean;
  updatedAt: string;
  createdAt: string;
  isPublic: boolean;
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
  theme: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    email?: string;
  };
}

interface Event {
  coverImage: string;
  topic: string;
  organizers: string[];
  link: string;
  date?: string;
}

interface UltimateProfileProps {
  userData: UserData;
  profiles: Profile[];
  folders: Folder[];
  activeProfile: string;
  selectedFolder: string | null;
  // For now, events is optional and will use dummy data if not provided
  events?: Event[];
}

const THEMES = {
  light: {
    bg: "bg-white",
    text: "text-gray-900",
    accent: "gray",
    heroBg: "from-gray-100 to-gray-200",
  },
  dark: {
    bg: "bg-white",
    text: "text-white",
    accent: "gray",
    heroBg: "from-gray-800 to-gray-900",
  },
  blue: {
    bg: "bg-white",
    text: "text-white",
    accent: "blue",
    heroBg: "from-blue-600 to-blue-400",
  },
  purple: {
    bg: "bg-white",
    text: "text-gray-900",
    accent: "purple",
    heroBg: "from-blue-500 to-purple-400",
  },
  teal: {
    bg: "bg-white",
    text: "text-white",
    accent: "teal",
    heroBg: "from-teal-500 to-teal-400",
  },
  green: {
    bg: "bg-white",
    text: "text-white",
    accent: "green",
    heroBg: "from-green-500 to-green-400",
  },
  gradient: {
    bg: "bg-white",
    text: "text-white",
    accent: "purple",
    heroBg: "from-purple-600 via-pink-600 to-blue-600",
  },
};

// const DUMMY_EVENTS: Event[] = [
//   {
//     coverImage: "/placeholder.jpg",
//     topic: "The Future of AI in Public Speaking",
//     organizers: ["TechConf 2024", "AI Speakers Guild"],
//     link: "https://example.com/event1",
//     date: "2024-09-15",
//   },
//   {
//     coverImage: "/placeholder.jpg",
//     topic: "Storytelling for Impact",
//     organizers: ["Impact Summit"],
//     link: "https://example.com/event2",
//     date: "2024-10-10",
//   },
//   {
//     coverImage: "/placeholder.jpg",
//     topic: "Mastering Virtual Presentations",
//     organizers: ["WebinarPro"],
//     link: "https://example.com/event3",
//     date: "2024-11-05",
//   },
// ];

export function DefaultTemplate({
  userData,
  profiles,
  folders,
  activeProfile: initialActiveProfile,
}: UltimateProfileProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] =
    useState<string>(initialActiveProfile);

  // Get theme configuration
  const theme = THEMES[userData.theme as keyof typeof THEMES] || THEMES.teal;

  const getActiveProfile = () => {
    if (!profiles || profiles.length === 0) return null;
    const publicProfiles = profiles.filter((profile) => profile.isPublic);
    return (
      publicProfiles.find((profile) => profile._id === activeProfile) ||
      profiles[0]
    );
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
            ? `bg-${theme.accent}-600 text-white`
            : `bg-white text-gray-900 border border-${theme.accent}-200 hover:bg-${theme.accent}-50`
        }
        focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`}
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

  // Use dummy events if not provided
  //   const eventList = events && events.length > 0 ? events : DUMMY_EVENTS;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* Hero Banner */}
      <div
        className={`relative w-full h-48 md:h-56 bg-gradient-to-br ${theme.heroBg} flex items-end justify-center`}
      >
        {/* Profile Card overlaps bottom edge of hero */}
        <div className='absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20'>
          <div className='w-36 h-36 md:w-44 md:h-44 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white'>
            <img
              src={userData.image || "/placeholder-user.jpg"}
              alt={userData.name}
              className='w-full h-full object-cover rounded-full'
            />
          </div>
          {getActiveProfile()?.isVerified && (
            <span
              className={`absolute bottom-2 right-2 bg-${theme.accent}-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow`}
            >
              <BadgeCheck className='h-4 w-4' /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto pt-24 px-4 md:px-8'>
        {/* Profile Section */}
        <section className='mb-16'>
          <div className='text-center md:text-left mb-6'>
            <h1 className={`text-3xl font-bold mb-2 text-center text-gray-900`}>
              {userData.name}
            </h1>
            <h2
              className={`text-xl text-center font-medium text-${theme.accent}-700 mb-4`}
            >
              {getActiveProfile()?.title}
            </h2>

            {/* Email and Social Links */}
            {userData.socialMedia &&
              (() => {
                const { twitter, linkedin, instagram, email } =
                  userData.socialMedia || {};
                const hasAny = twitter || linkedin || instagram || email;
                if (!hasAny) return null;
                return (
                  <div className='flex flex-col sm:flex-row items-center gap-4 justify-center'>
                    <div className='flex gap-2'>
                      {linkedin && (
                        <a
                          href={linkedin}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={`rounded-full p-2 border border-${theme.accent}-600 bg-white text-${theme.accent}-700 hover:bg-${theme.accent}-600 hover:text-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`}
                          aria-label='LinkedIn'
                        >
                          <Linkedin className='h-4 w-4' />
                        </a>
                      )}
                      {twitter && (
                        <a
                          href={twitter}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={`rounded-full p-2 border border-${theme.accent}-600 bg-white text-${theme.accent}-700 hover:bg-${theme.accent}-600 hover:text-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`}
                          aria-label='Twitter'
                        >
                          <Twitter className='h-4 w-4' />
                        </a>
                      )}
                      {instagram && (
                        <a
                          href={instagram}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={`rounded-full p-2 border border-${theme.accent}-600 bg-white text-${theme.accent}-700 hover:bg-${theme.accent}-600 hover:text-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`}
                          aria-label='Instagram'
                        >
                          <Instagram className='h-4 w-4' />
                        </a>
                      )}
                      {email && (
                        <a
                          href={`mailto:${email}`}
                          className={`rounded-full p-2 border border-${theme.accent}-600 bg-white text-${theme.accent}-700 hover:bg-${theme.accent}-600 hover:text-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`}
                          aria-label='Email'
                        >
                          <Mail className='h-4 w-4' />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Profile Selector */}
          <div className='flex flex-wrap gap-2 justify-center mb-8'>
            {profiles.map((profile) => {
              if (!profile.isPublic) return null;
              return (
                <button
                  key={profile._id}
                  type='button'
                  onClick={() => setActiveProfile(profile._id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeProfile === profile._id
                      ? `bg-${theme.accent}-600 text-white shadow`
                      : `bg-white text-${theme.accent}-700 border border-${theme.accent}-200 hover:bg-${theme.accent}-50`
                  } focus:outline-none focus:ring-2 focus:ring-${
                    theme.accent
                  }-400`}
                  aria-pressed={activeProfile === profile._id}
                >
                  {profile.title}
                </button>
              );
            })}
          </div>

          {/* Bios */}
          <div className='space-y-4 mb-8'>
            {getActiveProfile()?.shortBio && (
              <div
                className={`bg-white rounded-xl shadow p-6 border-t-4 border-${theme.accent}-400`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-bold'>Short Bio</h3>
                  <CopyButton
                    text={getActiveProfile()?.shortBio || ""}
                    type='short'
                    label='Copy'
                  />
                </div>
                <p className='text-gray-700 leading-relaxed'>
                  {getActiveProfile()?.shortBio}
                </p>
              </div>
            )}

            {getActiveProfile()?.mediumBio && (
              <div
                className={`bg-white rounded-xl shadow p-6 border-t-4 border-${theme.accent}-400`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-bold'>Medium Bio</h3>
                  <CopyButton
                    text={getActiveProfile()?.mediumBio || ""}
                    type='medium'
                    label='Copy'
                  />
                </div>
                <p className='text-gray-700 leading-relaxed'>
                  {getActiveProfile()?.mediumBio}
                </p>
              </div>
            )}

            {getActiveProfile()?.longBio && (
              <div
                className={`bg-white rounded-xl shadow p-6 border-t-4 border-${theme.accent}-400`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-bold'>Long Bio</h3>
                  <CopyButton
                    text={getActiveProfile()?.longBio || ""}
                    type='long'
                    label='Copy'
                  />
                </div>
                <p className='text-gray-700 leading-relaxed'>
                  {getActiveProfile()?.longBio}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className='mb-16'>
          {folders.length > 0 ? (
            <>
              <h2 className='text-2xl text-center font-bold mb-8 md:text-left'>
                Image Gallery
              </h2>

              <div className='space-y-8'>
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    className='bg-white rounded-xl shadow overflow-hidden'
                  >
                    <div className='p-6 border-b border-gray-100'>
                      <h3 className='text-xl font-semibold mb-2'>
                        {folder.name}
                      </h3>
                      <p className='text-gray-600'>{folder.description}</p>
                    </div>

                    {folder.images.length > 0 ? (
                      <div className='p-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                          {folder.images.map((image) => (
                            <div
                              key={image._id}
                              className='relative group rounded-lg overflow-hidden'
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                className='w-full h-full object-cover'
                              />
                              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg'>
                                <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                  <button
                                    onClick={() =>
                                      downloadImage(image.url, image.name)
                                    }
                                    disabled={downloadingImage === image.name}
                                    className={`bg-white/90 text-${theme.accent}-900 hover:bg-white rounded-full p-2 shadow`}
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
                      </div>
                    ) : (
                      <div className='p-6 text-center text-gray-500'>
                        No images in this folder
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='text-center text-gray-500 py-12'>
              <p>No image galleries available</p>
            </div>
          )}
        </section>

        {/* Events Section */}
        {/* <section className='mb-16'>
          <h2 className='text-2xl font-bold mb-8 text-center md:text-left'>
            Events
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {eventList.map((event, idx) => (
              <div
                key={idx}
                className='rounded-xl bg-white shadow border border-teal-200 overflow-hidden flex flex-col'
              >
                <div className='relative h-32 w-full overflow-hidden'>
                  <img
                    src={event.coverImage}
                    alt={event.topic}
                    className='w-full h-full object-cover'
                  />
                  <a
                    href={event.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='absolute top-2 right-2 bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow hover:bg-teal-700 transition'
                  >
                    <ExternalLink className='h-3 w-3' /> Event Link
                  </a>
                </div>
                <div className='p-4 flex-1 flex flex-col gap-2'>
                  <h4 className='font-semibold text-lg mb-1'>{event.topic}</h4>
                  <div className='flex flex-wrap gap-2 text-xs text-gray-600'>
                    {event.organizers.map((org, i) => (
                      <span
                        key={i}
                        className='bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full'
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                  {event.date && (
                    <div className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                      <Calendar className='h-3 w-3 text-teal-500' />
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </div>

      {/* Footer */}
      <footer className='mt-16 py-8 border-t border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 md:px-8'>
          <div className='text-center'>
            <p className='text-gray-500 text-sm'>
              © {new Date().getFullYear()} SpeakerKit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

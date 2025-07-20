"use client";

import { slugify } from "@/lib/utils";
import {
  BadgeCheck,
  Check,
  Copy,
  Download,
  Instagram,
  Linkedin,
  Mail,
  Mic,
  Twitter,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const events = [
  {
    title: "GenAI Supercharges Your Vue Dev Workflow",
    event: "Vue.js Global Summit'25 AI Edition",
    date: "May 21st, 2025",
    location: "Online",
    type: "Conference",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1747854649536/a3515968-abbd-4e31-8386-8617c83ee55d.png",
    link: "https://geekle.us/schedule/vue25",
  },
  {
    title:
      "AI-powered Productivity: Boosting Productivity for Software Engineers using Open-Source LLMs",
    event: "Conf42 Machine Learning 2025 - Online",
    date: "May 08th, 2025",
    location: "Online",
    type: "Conference",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1747834446844/bb21373d-f92f-48ac-a5f5-9d6a1611e020.jpeg",
    link: "https://www.conf42.com/Machine_Learning_2025_Ayodele_Samuel_Adebayo_productivity_entrepreneurs_solo",
  },
  {
    title:
      "Supercharging Your Workflow with AI: Tools, Tips, and Best Practices",
    event: "Build with AI - 2025, University of Ilorin",
    date: "April 12th, 2025",
    location:
      "Physical - Ilorin Innovation Hub, Ahmadu Bello Way, Ilorin, 240101 ",
    type: "Meetup",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1744064507202/0023be79-d838-40cd-b365-630808f0b264.jpeg",
    link: "https://gdsc-unilorin.vercel.app/speakers",
  },
  {
    title:
      "Building Faster: Supercharging Development with Supabase & AI Coding Tools",
    event: "Supabase Launch Week 14",
    date: "Match 29th, 2025",
    location: "Physical - MALhub, Ilorin, Kwara State",
    type: "Meetup",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1742655257788/2a0924d2-c891-47fc-9652-96078357f8ed.jpeg",
    link: "https://t.co/emVNXFKn7G",
  },
  {
    title: "Becoming a better development in 2024",
    event: "Lead DevRel",
    date: "Feb 16th, 2024",
    location: "Virtual",
    type: "Podcast",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1735469108829/af94f334-cf99-4e71-92dd-5c62d531cd71.jpeg",
    link: "https://open.spotify.com/episode/6Go2VbO3BevU3zHFi73hWU",
  },
  {
    title: "Tech Career Accelerator - Strategies and Opportunities",
    event: "CodeSquad LLC",
    date: "May 20th, 2023",
    location: "Physical - Ilorin, Kwara State",
    type: "Meetup",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1735736957582/61f99d36-5b9d-40c0-a857-347dd60e0479.jpeg",
    link: "https://www.canva.com/design/DAFjZYUeCm0/Qr-YgEqDGcXN56bt8h8gDw/view",
  },
  {
    title: "Getting Started with W3Schools Spaces",
    event: "W3Schools Event",
    date: "Oct 30th, 2021",
    location: "YouTube Live",
    type: "Product Demo",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1735603811679/52213608-452d-4f06-a3ef-39032483085e.jpeg",
    link: "https://www.youtube.com/watch?v=62MGw4ybfJU",
  },
  {
    title: "Job Opportunities for Junior Developers",
    event: "W3Schools Event",
    date: "Oct 29th, 2021",
    location: "YouTube Live",
    type: "Interview",
    coverImage:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1735603823640/29cea940-5bb2-4f02-a4a2-83de61efa860.webp",
    link: "https://www.youtube.com/watch?v=NY6_2ozQilE",
  },

  // AI-powered Productivity: Boosting Productivity for Software Engineers using Open-Source LLMs
  // Conf42 Machine Learning 2025 - Online
  // May 08 2025
  // https://www.conf42.com/Machine_Learning_2025_Ayodele_Samuel_Adebayo_productivity_entrepreneurs_solo
  // https://cdn.hashnode.com/res/hashnode/image/upload/v1747834446844/bb21373d-f92f-48ac-a5f5-9d6a1611e020.jpeg

  // {
  //   title: "AI in Modern Software Engineering",
  //   event: "AI Dev Summit",
  //   date: "November 10-12, 2025",
  //   location: "London, UK",
  //   type: "Podcast",
  //   coverImage:
  //     "https://kzmjkys2ll9nyn2sgbq0.lite.vusercontent.net/placeholder.svg",
  //   link: "https://open.spotify.com/episode/6Go2VbO3BevU3zHFi73hWU",
  // },
];

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get theme configuration
  // const theme = THEMES[userData.theme as keyof typeof THEMES] || THEMES.teal;
  const theme = THEMES.teal;

  // Handle URL query parameter for profile selection
  useEffect(() => {
    const profileFromUrl = searchParams.get("profile");
    if (profileFromUrl) {
      // Find profile by slug
      const matchingProfile = findProfileBySlug(profileFromUrl);
      if (matchingProfile && matchingProfile.isPublic) {
        setActiveProfile(matchingProfile._id);
      }
    }
  }, [searchParams, profiles]);

  // Function to find profile by slug
  const findProfileBySlug = (slug: string) => {
    return profiles.find((profile) => slugify(profile.title) === slug);
  };

  // Function to update URL when switching profiles
  const updateProfileInUrl = (profileId: string) => {
    const profile = profiles.find((p) => p._id === profileId);
    if (profile && profile.isPublic) {
      const params = new URLSearchParams(searchParams);
      params.delete("activities");
      params.set("profile", slugify(profile.title));
      router.push(`${pathname}?${params.toString()}`);
    }
  };

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

  const userIcons = [
    "notion",
    "canva",
    "google-docs",
    "figma",
    "powerpoint",
  ].slice(0, 5);

  // Display name mapping for tooltips
  const iconDisplayNames = {
    notion: "Notion",
    canva: "Canva",
    "google-docs": "Google Docs",
    figma: "Figma",
    powerpoint: "PowerPoint",
  };

  const brandIcons = {
    notion: (
      <svg
        width={241}
        height={250}
        viewBox='0 0 241 250'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M154.28 0.568336L15.9487 10.7849C4.79051 11.7515 0.907227 19.0431 0.907227 27.7847V179.433C0.907227 186.241 3.32386 192.066 9.15712 199.849L41.6734 242.132C47.015 248.94 51.8733 250.399 62.0731 249.915L222.713 240.191C236.296 239.224 240.188 232.899 240.188 222.207V51.6011C240.188 46.0761 238.004 44.4845 231.579 39.7679C231.21 39.5016 230.84 39.2349 230.471 38.9679L186.322 7.85992C175.638 0.0933423 171.272 -0.88998 154.28 0.568336ZM65.7064 48.8094C52.5899 49.6928 49.615 49.8928 42.1651 43.8345L23.2236 28.768C21.2986 26.818 22.2653 24.3847 27.1152 23.9014L160.097 14.1848C171.263 13.2099 177.08 17.1015 181.447 20.5014L204.255 37.0262C205.23 37.5179 207.655 40.4262 204.738 40.4262L67.4064 48.6928L65.7064 48.8094ZM50.415 220.749V75.9175C50.415 69.5925 52.3566 66.6759 58.1732 66.1842L215.905 56.951C221.255 56.4677 223.671 59.8677 223.671 66.1842V210.049C223.671 216.374 222.696 221.724 213.963 222.207L63.0231 230.957C54.2899 231.441 50.415 228.532 50.415 220.749ZM199.413 83.684C200.38 88.059 199.413 92.4339 195.038 92.9339L187.763 94.3756V201.308C181.447 204.708 175.63 206.649 170.772 206.649C163.007 206.649 161.064 204.217 155.251 196.937C155.249 196.936 155.248 196.934 155.247 196.933L107.673 122.084V194.499L122.722 197.908C122.722 197.908 122.722 206.658 110.581 206.658L77.1063 208.599C76.1313 206.649 77.1063 201.791 80.4979 200.824L89.2395 198.399V102.65L77.1063 101.667C76.1313 97.2922 78.5563 90.9756 85.3562 90.484L121.272 88.0673L170.772 163.883V96.8089L158.155 95.3589C157.18 90.0006 161.064 86.109 165.914 85.634L199.413 83.684Z'
          fill='white'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M15.9487 10.7849L154.28 0.568336C171.272 -0.88998 175.638 0.0933423 186.322 7.85992L230.479 38.9679C230.856 39.2442 231.219 39.5101 231.569 39.7668C238.007 44.4801 240.188 46.077 240.188 51.6011V222.207C240.188 232.899 236.304 239.224 222.713 240.191L62.0731 249.915C51.8733 250.399 47.015 248.94 41.6734 242.132L9.15712 199.849C3.32386 192.066 0.907227 186.241 0.907227 179.433V27.7847C0.907227 19.0431 4.79051 11.7515 15.9487 10.7849ZM65.7064 48.8094C52.5899 49.6928 49.615 49.8928 42.1651 43.8345L23.2236 28.768C21.2986 26.818 22.2653 24.3847 27.1152 23.9014L160.097 14.1848C171.263 13.2099 177.08 17.1015 181.447 20.5014L204.255 37.0262C205.23 37.5179 207.655 40.4262 204.738 40.4262L67.4064 48.6928L65.7064 48.8094ZM50.415 75.9175V220.749C50.415 228.532 54.2899 231.441 63.0231 230.957L213.963 222.207C222.696 221.724 223.671 216.374 223.671 210.049V66.1842C223.671 59.8677 221.255 56.4677 215.905 56.951L58.1732 66.1842C52.3566 66.6759 50.415 69.5925 50.415 75.9175ZM199.413 83.684C200.38 88.059 199.413 92.4339 195.038 92.9339L187.763 94.3756V201.308C181.447 204.708 175.63 206.649 170.772 206.649C163.007 206.649 161.064 204.217 155.251 196.937L155.247 196.933L107.673 122.084V194.499L122.722 197.908C122.722 197.908 122.722 206.658 110.581 206.658L77.1063 208.599C76.1313 206.649 77.1063 201.791 80.4979 200.824L89.2395 198.399V102.65L77.1063 101.667C76.1313 97.2922 78.5563 90.9756 85.3562 90.484L121.272 88.0673L170.772 163.883V96.8089L158.155 95.3589C157.18 90.0006 161.064 86.109 165.914 85.634L199.413 83.684Z'
          fill='white'
        />
      </svg>
    ),
    canva: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        width={241}
        height={250}
        viewBox='0 0 48 48'
      >
        <linearGradient
          id='N8aMJ-jZ4-cfldZrsnvhda_iWw83PVcBpLw_gr1'
          x1='38.263'
          x2='10.15'
          y1='1373.62'
          y2='1342.615'
          gradientTransform='translate(0 -1333.89)'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset={0} stopColor='#823af3' />
          <stop offset='.36' stopColor='#4b66e1' />
          <stop offset='.906' stopColor='#01f1c4' />
        </linearGradient>
        <path
          fill='url(#N8aMJ-jZ4-cfldZrsnvhda_iWw83PVcBpLw_gr1)'
          fillRule='evenodd'
          d='M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24	S12.955,4,24,4S44,12.955,44,24z'
          clipRule='evenodd'
        />
        <path
          fill='#fff'
          fillRule='evenodd'
          d='M29.194,26.962c-0.835,0.915-2.007,1.378-2.556,1.378	c-0.635,0-0.982-0.389-1.053-0.974c-0.024-0.224-0.016-0.45,0.024-0.673c0.21-1.31,0.692-2.124,0.662-2.372	c-0.009-0.071-0.049-0.106-0.101-0.106c-0.406,0-1.83,1.47-2.046,2.443l-0.168,0.779c-0.11,0.549-0.648,0.902-1.018,0.902	c-0.177,0-0.311-0.088-0.334-0.283c-0.007-0.089,0-0.178,0.021-0.266l0.079-0.41c-0.768,0.574-1.596,0.962-1.984,0.962	c-0.53,0-0.827-0.283-0.933-0.709c-0.35,0.461-0.813,0.709-1.306,0.709c-0.63,0-1.237-0.417-1.528-1.034	c-0.415,0.466-0.907,0.922-1.496,1.299c-0.869,0.55-1.836,0.992-2.982,0.992c-1.058,0-1.956-0.566-2.453-1.026	c-0.737-0.69-1.126-1.718-1.241-2.656c-0.362-2.957,1.438-6.834,4.227-8.533c0.64-0.39,1.357-0.584,2.008-0.584	c1.34,0,2.34,0.958,2.48,2.104c0.126,1.032-0.286,1.924-1.431,2.501c-0.584,0.296-0.874,0.282-0.965,0.141	c-0.061-0.094-0.026-0.254,0.091-0.351c1.076-0.899,1.096-1.637,0.97-2.677c-0.082-0.669-0.522-1.098-1.016-1.098	c-2.115,0-5.149,4.745-4.727,8.197c0.165,1.346,0.99,2.904,2.682,2.904c0.564,0,1.162-0.159,1.694-0.425	c0.928-0.474,1.453-0.85,1.98-1.464c-0.13-1.596,1.24-3.6,3.278-3.6c0.882,0,1.612,0.354,1.698,1.062	c0.108,0.885-0.646,1.062-0.928,1.062c-0.247,0-0.643-0.071-0.671-0.301c-0.03-0.248,0.534-0.106,0.464-0.673	c-0.043-0.354-0.411-0.478-0.763-0.478c-1.269,0-1.97,1.77-1.835,2.869c0.061,0.496,0.315,0.991,0.774,0.991	c0.37,0,0.904-0.531,1.109-1.31c0.13-0.531,0.632-0.885,1.003-0.885c0.194,0,0.328,0.088,0.352,0.283	c0.008,0.071,0.002,0.16-0.021,0.266c-0.042,0.23-0.219,0.996-0.21,1.154c0.006,0.138,0.086,0.328,0.326,0.328	c0.19,0,0.89-0.378,1.538-0.958c0.203-1.051,0.454-2.351,0.474-2.454c0.079-0.426,0.232-0.865,1.096-0.865	c0.177,0,0.311,0.088,0.337,0.301c0.008,0.07,0.002,0.16-0.021,0.266l-0.242,1.093c0.758-1.01,1.936-1.752,2.642-1.752	c0.3,0,0.531,0.158,0.57,0.478c0.022,0.178-0.03,0.478-0.147,0.814c-0.251,0.69-0.533,1.727-0.72,2.62	c-0.04,0.19,0.026,0.476,0.373,0.476c0.277,0,1.166-0.339,1.885-1.288c-0.005-0.134-0.007-0.27-0.007-0.408	c0-0.744,0.053-1.346,0.194-1.787c0.141-0.461,0.723-0.902,1.11-0.902c0.194,0,0.335,0.106,0.335,0.318	c0,0.071-0.018,0.16-0.053,0.248c-0.264,0.779-0.405,1.506-0.405,2.231c0,0.407,0.088,1.062,0.177,1.398	c0.018,0.071,0.034,0.142,0.105,0.142c0.123,0,0.952-0.814,1.551-1.806c-0.53-0.337-0.829-0.956-0.829-1.718	c0-1.274,0.758-1.93,1.498-1.93c0.582,0,1.11,0.425,1.11,1.274c0,0.532-0.212,1.134-0.51,1.718c0,0,0.123,0.018,0.176,0.018	c0.458,0,0.811-0.213,1.006-0.443c0.088-0.1,0.17-0.178,0.248-0.224c0.59-0.713,1.455-1.228,2.47-1.228	c0.864,0,1.61,0.337,1.696,1.045c0.11,0.902-0.661,1.08-0.926,1.08c-0.264,0-0.661-0.071-0.689-0.301s0.551-0.106,0.484-0.654	c-0.043-0.354-0.413-0.496-0.766-0.496c-1.182,0-1.994,1.576-1.838,2.85c0.062,0.514,0.299,1.01,0.758,1.01	c0.37,0,0.923-0.532,1.127-1.31c0.131-0.514,0.632-0.885,1.002-0.885c0.176,0,0.328,0.088,0.354,0.301	c0.013,0.106-0.03,0.337-0.227,1.168c-0.081,0.354-0.097,0.655-0.066,0.903c0.063,0.514,0.298,0.85,0.516,1.045	c0.079,0.07,0.126,0.158,0.132,0.213c0.017,0.142-0.091,0.266-0.267,0.266c-0.053,0-0.123,0-0.181-0.035	c-0.908-0.372-1.285-0.991-1.391-1.576c-0.35,0.442-0.814,0.69-1.29,0.69c-0.811,0-1.603-0.709-1.715-1.629	c-0.046-0.378-0.001-0.785,0.123-1.184c-0.329,0.203-0.683,0.316-1.001,0.316c-0.106,0-0.194,0-0.299-0.018	c-0.793,1.15-1.622,1.947-2.257,2.302c-0.264,0.142-0.51,0.213-0.687,0.213c-0.142,0-0.3-0.035-0.37-0.159	C29.367,27.91,29.258,27.474,29.194,26.962L29.194,26.962z M32.067,23.191c0,0.496,0.246,1.01,0.564,1.346	c0.124-0.337,0.194-0.673,0.194-1.01c0-0.638-0.247-0.921-0.441-0.921C32.155,22.606,32.067,22.926,32.067,23.191z'
          clipRule='evenodd'
        />
      </svg>
    ),
    "google-docs": (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        width={241}
        height={250}
        viewBox='0 0 48 48'
      >
        <path
          fill='#2196f3'
          d='M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z'
        />
        <path fill='#bbdefb' d='M40 13L30 13 30 3z' />
        <path fill='#1565c0' d='M30 13L40 23 40 13z' />
        <path
          fill='#e3f2fd'
          d='M15 23H33V25H15zM15 27H33V29H15zM15 31H33V33H15zM15 35H25V37H15z'
        />
      </svg>
    ),
    figma: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        width={241}
        height={250}
        viewBox='0 0 48 48'
      >
        <path
          fill='#e64a19'
          d='M26,17h-8c-3.866,0-7-3.134-7-7v0c0-3.866,3.134-7,7-7h8V17z'
        />
        <path
          fill='#7c4dff'
          d='M25,31h-7c-3.866,0-7-3.134-7-7v0c0-3.866,3.134-7,7-7h7V31z'
        />
        <path
          fill='#66bb6a'
          d='M18,45L18,45c-3.866,0-7-3.134-7-7v0c0-3.866,3.134-7,7-7h7v7C25,41.866,21.866,45,18,45z'
        />
        <path
          fill='#ff7043'
          d='M32,17h-7V3h7c3.866,0,7,3.134,7,7v0C39,13.866,35.866,17,32,17z'
        />
        <circle cx={32} cy={24} r={7} fill='#29b6f6' />
      </svg>
    ),
    powerpoint: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        width={241}
        height={250}
        viewBox='0 0 30 30'
      >
        <circle cx='17.5' cy='15.5' r={12} fill='#f78f8f' />
        <path
          fill='#c74343'
          d='M17.5,28C10.607,28,5,22.393,5,15.5S10.607,3,17.5,3S30,8.607,30,15.5S24.393,28,17.5,28z M17.5,4 C11.159,4,6,9.159,6,15.5S11.159,27,17.5,27S29,21.841,29,15.5S23.841,4,17.5,4z'
        />
        <path
          fill='#ef7575'
          d='M12.84,22.5H3.16c-1.469,0-2.66-1.191-2.66-2.66V11.16c0-1.469,1.191-2.66,2.66-2.66h9.681 c1.469,0,2.66,1.191,2.66,2.66v8.681C15.5,21.309,14.309,22.5,12.84,22.5z'
        />
        <path
          fill='#c43737'
          d='M12.841,23H3.159C1.417,23,0,21.583,0,19.841v-8.682C0,9.417,1.417,8,3.159,8h9.682 C14.583,8,16,9.417,16,11.159v8.682C16,21.583,14.583,23,12.841,23z M3.159,9C1.969,9,1,9.969,1,11.159v8.682 C1,21.031,1.969,22,3.159,22h9.682C14.031,22,15,21.031,15,19.841v-8.682C15,9.969,14.031,9,12.841,9H3.159z'
        />
        <g>
          <path
            fill='#ffc49c'
            d='M17.5,3.5v12h12C29.5,8.873,24.127,3.5,17.5,3.5z'
          />
          <path
            fill='#c74343'
            d='M30,16H17V3h0.5C24.393,3,30,8.607,30,15.5V16z M18,15h10.989C28.733,9.056,23.944,4.267,18,4.011 V15z'
          />
        </g>
        <g>
          <path
            fill='#fff'
            d='M9,11H7H6H5v9h2v-3h2c1.657,0,3-1.343,3-3S10.657,11,9,11z M9,15H7v-2h2c0.552,0,1,0.448,1,1 C10,14.552,9.552,15,9,15z'
          />
        </g>
      </svg>
    ),
  };

  // Use dummy events if not provided
  //   const eventList = events && events.length > 0 ? events : DUMMY_EVENTS;

  // const socialStyles = `rounded-full p-2 border border-${theme.accent}-600 bg-white text-${theme.accent}-700 hover:bg-${theme.accent}-600 hover:text-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`;
  const socialStyles = `rounded-full p-2 border border-${theme.accent}-600 bg-white text-${theme.accent}-700 hover:bg-white hover:text-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* Hero Banner */}
      <div
        className={`relative w-full h-48 md:h-56 bg-gradient-to-br ${theme.heroBg} flex items-end justify-center`}
      >
        {/* Scattered Speaker Tools - Limited to 5 tools */}
        {userIcons.map((icon, index) => {
          // 5 well-spaced positions for mobile and desktop
          const positions = [
            "top-2 left-4 md:top-4 md:left-8", // notion
            "top-2 right-4 md:top-4 md:right-16", // canva
            "top-8 left-1/4 md:top-12 md:left-72", // doc
            "top-8 right-1/4 md:top-12 md:right-1/3", // figma
            "top-[-10px] left-[56%] md:top-12 md:left-1/3", // ppt
          ];

          const position = positions[index];
          const rotation = (index * 18) % 360; // 18° increments for 5 tools
          const scale = 0.8 + index * 0.06; // Scale between 0.8 and 1.1

          return (
            <div
              key={icon}
              className={`absolute opacity-20 hover:opacity-40 transition-opacity duration-300 group ${position}`}
              style={{
                transform: `rotate(${rotation}deg) scale(${scale * 0.4})`, // Even smaller scale on mobile
              }}
            >
              <div className='w-6 h-6 md:w-12 md:h-12 relative'>
                {brandIcons[icon as keyof typeof brandIcons]}
                {/* Tooltip */}
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-lg font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-[9999]'>
                  {iconDisplayNames[icon as keyof typeof iconDisplayNames]}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
                </div>
              </div>
            </div>
          );
        })}

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
        {/* Profile Header */}
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
                        className={socialStyles}
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
                        className={socialStyles}
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
                        className={socialStyles}
                        aria-label='Instagram'
                      >
                        <Instagram className='h-4 w-4' />
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className={socialStyles}
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
                onClick={() => {
                  setActiveProfile(profile._id);
                  updateProfileInUrl(profile._id);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeProfile === profile._id &&
                  !searchParams.get("activities")
                    ? `bg-${theme.accent}-600 text-white shadow`
                    : `bg-white text-${theme.accent}-700 border border-${theme.accent}-200 hover:bg-${theme.accent}-50`
                } focus:outline-none focus:ring-2 focus:ring-${
                  theme.accent
                }-400`}
                aria-pressed={
                  activeProfile === profile._id &&
                  !searchParams.get("activities")
                }
              >
                {profile.title}
              </button>
            );
          })}

          {/* Activities Tab */}
          <button
            type='button'
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete("profile");
              params.set("activities", "true");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
              searchParams.get("activities")
                ? `bg-${theme.accent}-600 text-white shadow`
                : `bg-white text-${theme.accent}-700 border border-${theme.accent}-200 hover:bg-${theme.accent}-50`
            } focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400`}
            aria-pressed={!!searchParams.get("activities")}
          >
            <Mic className='h-4 w-4' /> My Talks
          </button>
        </div>

        {/* Conditional Content Rendering */}
        {searchParams.get("activities") ? (
          // Activities/Events Section
          <section className='mb-16'>
            {/* <h2 className='text-2xl text-center font-bold mb-8 md:text-left'>
              My Talks & Events
            </h2> */}

            <div className='space-y-6 max-w-4xl mx-auto'>
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row h-auto md:h-64'
                >
                  <div className='w-full md:w-64 h-48 md:h-full flex-shrink-0 order-1 md:order-2'>
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className='w-full h-full object-cover'
                    />
                  </div>

                  <div className='flex-1 p-6 flex flex-col order-2 md:order-1'>
                    <div className='flex items-center gap-3 mb-3'>
                      <span className='flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-bold'>
                        {idx + 1}
                      </span>
                      <span
                        className={`inline-block bg-${theme.accent}-100 text-${theme.accent}-700 px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {event.type}
                      </span>
                    </div>

                    <h3 className='font-semibold text-xl mb-2 line-clamp-2 flex-shrink-0'>
                      {event.title}
                    </h3>

                    <p className='font-medium text-gray-800 mb-3 flex-shrink-0'>
                      {event.event}
                    </p>

                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4 flex-shrink-0'>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-500'>📅</span>
                        <span>{event.date}</span>
                      </div>

                      <div className='flex items-center gap-2 min-w-0 flex-1'>
                        <span className='text-gray-500 flex-shrink-0'>📍</span>
                        <span className='truncate' title={event.location}>
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className='mt-auto'>
                      <a
                        href={event.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-${theme.accent}-600 text-white rounded-lg text-sm font-semibold hover:bg-${theme.accent}-700 transition-colors`}
                      >
                        View Event
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // Profile Content
          <>
            {/* Bios */}
            <section className='mb-16'>
              <div className='space-y-4 mb-8'>
                {getActiveProfile()?.shortBio && (
                  <div
                    className={`bg-white rounded-xl shadow p-6 border-t-4 border-${theme.accent}-400`}
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='text-lg font-bold'>Quick Bio</h3>
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
                      <h3 className='text-lg font-bold'>Full Bio</h3>
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
                                        disabled={
                                          downloadingImage === image.name
                                        }
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
          </>
        )}

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

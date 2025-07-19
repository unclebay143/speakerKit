import { OG_IMAGE, SPEAKERKIT_BASE_URL } from "@/lib/utils";
import { Metadata } from "next";
import FeaturesSection from "../components/FeaturesSection";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import PricingPreview from "../components/PricingPreview";
import { SparklesCore } from "../components/sparkles";

export const metadata: Metadata = {
  title: "SpeakerKit - Professional Speaker Profile Platform",
  description:
    "Create stunning professional speaker profiles, showcase your expertise, and connect with event organizers. Build your speaking brand with SpeakerKit's modern, customizable profile platform.",
  keywords: [
    "speaker profile",
    "professional speaker",
    "speaking platform",
    "event speaker",
    "conference speaker",
    "public speaker",
    "speaker portfolio",
    "speaking opportunities",
    "speaker management",
    "speaker marketing",
    "SpeakerKit",
    "speaking business",
  ],
  authors: [{ name: "SpeakerKit Team" }],
  creator: "SpeakerKit",
  publisher: "SpeakerKit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    title: "SpeakerKit - Professional Speaker Profile Platform",
    description:
      "Create stunning professional speaker profiles, showcase your expertise, and connect with event organizers. Build your speaking brand with SpeakerKit's modern, customizable profile platform.",
    url: SPEAKERKIT_BASE_URL,
    siteName: "SpeakerKit",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SpeakerKit - Professional Speaker Profile Platform",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakerKit - Professional Speaker Profile Platform",
    description:
      "Create stunning professional speaker profiles, showcase your expertise, and connect with event organizers.",
    images: [OG_IMAGE],
    creator: "@speakerkit",
    site: "@speakerkit",
  },
  alternates: {
    canonical: SPEAKERKIT_BASE_URL,
  },
  other: {
    "twitter:label1": "Platform",
    "twitter:data1": "Speaker Profile Builder",
    "twitter:label2": "Features",
    "twitter:data2": "Customizable, Professional, Modern",
  },
};

export default function Home() {
  return (
    <main className='min-h-screen overflow-y-auto overflow-x-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02] relative scroll-smooth'>
      <Navbar />
      {/* Ambient background with moving particles */}
      <div className='h-full w-full absolute inset-0 z-0'>
        <SparklesCore
          id='tsparticlesfullpage'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className='w-full h-full'
          particleColor='#FFFFFF'
        />
      </div>

      <div className='relative z-10 min-h-screen overflow-x-hidden'>
        <Hero />
      </div>
      <div className='relative z-10 min-h-screen'>
        <FeaturesSection />
      </div>
      <div className='relative z-10 min-h-screen'>
        <PricingPreview />
      </div>
    </main>
  );
}

import { OG_IMAGE, SPEAKERKIT_BASE_URL } from "@/lib/utils";
import AuthProvider from "@/providers/SessionProvider";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

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
  authors: [
    { name: "SpeakerKit Team", url: SPEAKERKIT_BASE_URL },
    {
      name: "UncleBigBay",
      url: "https://unclebigbay.com",
    },
  ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <Script
          defer
          data-website-id='6881d4b0e5245ab401861033'
          data-domain='speakerkit.org'
          src='https://datafa.st/js/script.js'
        />
      </head>
      <body>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

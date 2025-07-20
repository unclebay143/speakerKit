"use client";

import { useState } from "react";
import PasswordSection from "./PasswordSection";
import ProfileImageSection from "./ProfileImageSection";
import ProfileInfoSection from "./ProfileInfoSection";
import SocialMediaSection from "./SocialMediaSection";
import SpeakerToolsSection from "./SpeakerToolsSection";
import ThemeSection from "./ThemeSection";
import VisibilitySection from "./VisibilitySection";

export function Settings() {
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-200 dark:border-green-800"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className='float-right font-bold'
          >
            ×
          </button>
        </div>
      )}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Account Settings
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your account preferences and security settings
        </p>
      </div>

      <ProfileImageSection />
      {/* Account Information */}
      <ProfileInfoSection />
      <SocialMediaSection />
      <SpeakerToolsSection />
      <ThemeSection />
      <VisibilitySection />
      <PasswordSection />
    </div>
  );
}

"use client";

import PasswordSection from "./PasswordSection";
import ProfileImageSection from "./ProfileImageSection";
import ProfileInfoSection from "./ProfileInfoSection";
import SocialMediaSection from "./SocialMediaSection";
import SpeakerToolsSection from "./SpeakerToolsSection";
import ThemeSection from "./ThemeSection";
import VisibilitySection from "./VisibilitySection";

export function Settings() {
  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Account Settings
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your account preferences and security settings
        </p>
      </div>

      <ProfileImageSection />
      <ProfileInfoSection />
      <SocialMediaSection />
      <SpeakerToolsSection />
      <ThemeSection />
      <VisibilitySection />
      <PasswordSection />
    </div>
  );
}

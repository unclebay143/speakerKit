"use client";

// YouTube Support Feature:
// - Supports both individual videos (youtubeVideo) and playlists (youtubePlaylist)
// - Automatically detects YouTube URLs and creates embeds
// - Supports youtu.be, youtube.com/watch, and youtube.com/playlist formats
// - Provides fallback to regular links for non-YouTube URLs
// - Shows YouTube badges and red-themed buttons for YouTube content
// - Responsive iframe embeds with hover effects

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl: string;
  title: string;
}

export default function YouTubeModal({
  isOpen,
  onClose,
  embedUrl,
  title,
}: YouTubeModalProps) {
  // Add autoplay parameter to the embed URL
  const autoplayUrl = embedUrl.includes("?")
    ? `${embedUrl}&autoplay=1&rel=0`
    : `${embedUrl}?autoplay=1&rel=0`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-7xl w-[90vw] h-[80vh] p-0 bg-black'>
        <div className='relative w-full h-full'>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-200'
          >
            <X className='w-5 h-5' />
          </button>

          {/* YouTube iframe */}
          <iframe
            src={autoplayUrl}
            title={title}
            className='w-full h-full'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

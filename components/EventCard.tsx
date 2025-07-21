"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getHoverVideoUrl,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
  type Event,
} from "@/lib/youtube-utils";
import { Edit, ExternalLink, Play, Trash2, Youtube } from "lucide-react";
import { useState } from "react";
import YouTubeModal from "./YouTubeModal";

interface EventCardProps {
  event: Event;
  index: number;
  theme?: {
    accent: string;
  };
  isDashboard?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  isDeleting?: boolean;
}

export default function EventCard({
  event,
  index,
  theme = { accent: "teal" },
  isDashboard = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: EventCardProps) {
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("");

  const hasYouTubeVideo =
    event.youtubeVideo && isYouTubeUrl(event.youtubeVideo);
  const hasYouTubePlaylist =
    event.youtubePlaylist && isYouTubeUrl(event.youtubePlaylist);
  const embedUrl = hasYouTubeVideo
    ? getYouTubeEmbedUrl(event.youtubeVideo!)
    : hasYouTubePlaylist
    ? getYouTubeEmbedUrl(event.youtubePlaylist!)
    : null;
  const thumbnailUrl = hasYouTubeVideo
    ? getYouTubeThumbnail(event.youtubeVideo!)
    : event.coverImage;
  const hoverVideoUrl = hasYouTubeVideo
    ? getHoverVideoUrl(event.youtubeVideo!)
    : null;

  const openYouTubeModal = (embedUrl: string, title: string) => {
    setCurrentVideoUrl(embedUrl);
    setCurrentVideoTitle(title);
    setIsYouTubeModalOpen(true);
  };

  const closeYouTubeModal = () => {
    setIsYouTubeModalOpen(false);
    setCurrentVideoUrl(null);
    setCurrentVideoTitle("");
  };

  return (
    <>
      <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
        <div className='flex flex-col md:flex-row h-auto md:h-64'>
          {/* Content Section */}
          <div className='flex-1 p-6 flex flex-col order-2 md:order-1'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <span className='flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-bold'>
                  {index + 1}
                </span>
                <Badge
                  variant='secondary'
                  className={`text-xs bg-${theme.accent}-100 text-${theme.accent}-700 border-${theme.accent}-200`}
                >
                  {event.type}
                </Badge>
                {(hasYouTubeVideo || hasYouTubePlaylist) && (
                  <div className='inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold'>
                    <Youtube className='w-3 h-3' />
                    YouTube
                  </div>
                )}
              </div>

              {/* Action Buttons - Only show on dashboard */}
              {isDashboard && (
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => onEdit?.(event)}
                    disabled={isDeleting}
                    className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => onDelete?.(event)}
                    className={`text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 ${
                      isDeleting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isDeleting}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              )}
            </div>

            <h4 className='font-semibold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2'>
              {event.title}
            </h4>

            <p className='text-gray-600 dark:text-gray-400 mb-3 flex-shrink-0'>
              {event.event}
            </p>

            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-shrink-0'>
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

            <div className='mt-auto flex gap-2'>
              {embedUrl ? (
                <Button
                  size='sm'
                  onClick={() => openYouTubeModal(embedUrl, event.title)}
                  className='inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white'
                >
                  <Play className='w-4 h-4' />
                  Watch Video
                </Button>
              ) : event.link ? (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => window.open(event.link, "_blank")}
                  className={`inline-flex items-center gap-2 bg-${theme.accent}-600 border-transparent text-white hover:bg-${theme.accent}-700`}
                >
                  View Event <ExternalLink className='w-4 h-4' />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Image/Video Section */}
          <div className='w-full md:w-64 h-48 md:h-full flex-shrink-0 order-1 md:order-2 relative'>
            {embedUrl ? (
              <div
                className='relative w-full h-full cursor-pointer group'
                onClick={() => openYouTubeModal(embedUrl, event.title)}
              >
                {/* YouTube embed - shows preview by default, plays on hover */}
                <iframe
                  src={embedUrl}
                  title={event.title}
                  className='w-full h-full pointer-events-none'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />

                {/* Hover video overlay - plays on hover */}
                {hoverVideoUrl && (
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
                    <iframe
                      src={hoverVideoUrl}
                      title={event.title}
                      className='w-full h-full'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Play button overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center'>
                  <div className='bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Play className='w-6 h-6 text-red-600' />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={thumbnailUrl || event.coverImage}
                alt={event.title}
                className='w-full h-full object-cover'
              />
            )}
          </div>
        </div>
      </Card>

      {currentVideoUrl && (
        <YouTubeModal
          isOpen={isYouTubeModalOpen}
          onClose={closeYouTubeModal}
          embedUrl={currentVideoUrl}
          title={currentVideoTitle}
        />
      )}
    </>
  );
}

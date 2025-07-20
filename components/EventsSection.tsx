"use client";

import {
  getHoverVideoUrl,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
  type Event,
} from "@/lib/youtube-utils";
import { useState } from "react";
import YouTubeModal from "./YouTubeModal";

interface EventsSectionProps {
  events: Event[];
  theme: {
    accent: string;
  };
}

export default function EventsSection({ events, theme }: EventsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("");
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const openModal = (embedUrl: string, title: string) => {
    setCurrentVideoUrl(embedUrl);
    setCurrentVideoTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideoUrl(null);
    setCurrentVideoTitle("");
  };

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      {events.map((event, idx) => {
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

        return (
          <div
            key={idx}
            className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row h-auto md:h-64'
          >
            <div className='w-full md:w-64 h-48 md:h-full flex-shrink-0 order-1 md:order-2 relative'>
              {embedUrl ? (
                <div
                  className='relative w-full h-full cursor-pointer'
                  onClick={() => openModal(embedUrl, event.title)}
                  onMouseEnter={() => setHoveredVideo(event.youtubeVideo!)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  {hoveredVideo === event.youtubeVideo && hoverVideoUrl ? (
                    <iframe
                      src={hoverVideoUrl}
                      title={event.title}
                      className='w-full h-full pointer-events-none'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                  ) : (
                    <iframe
                      src={embedUrl || ""}
                      title={event.title}
                      className='w-full h-full pointer-events-none'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                  )}
                  <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center'>
                    <div className='bg-white bg-opacity-90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity'>
                      <svg
                        className='w-6 h-6 text-red-600'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M8 5v14l11-7z' />
                      </svg>
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
                {(hasYouTubeVideo || hasYouTubePlaylist) && (
                  <span className='inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold'>
                    <svg
                      className='w-3 h-3'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                    </svg>
                    {hasYouTubePlaylist ? "Playlist" : "Video"}
                  </span>
                )}
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

              <div className='mt-auto flex gap-2'>
                {embedUrl ? (
                  <>
                    <a
                      href={event.link}
                      target='_blank'
                      rel='noopener'
                      className={`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors`}
                    >
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                      </svg>
                      Watch on YouTube
                    </a>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        );
      })}

      {currentVideoUrl && (
        <YouTubeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          embedUrl={currentVideoUrl}
          title={currentVideoTitle}
        />
      )}
    </div>
  );
}

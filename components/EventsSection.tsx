"use client";

import { type Event } from "@/lib/youtube-utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { dummy_events } from "./templates/default";

interface EventsSectionProps {
  userSlug: string;
  theme: {
    accent: string;
  };
}

interface PaginatedEventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    totalEvents: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function EventsSection({ userSlug, theme }: EventsSectionProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<PaginatedEventsResponse>({
    queryKey: ["events", userSlug],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `/api/users/${userSlug}/events?page=${pageParam}&limit=10`
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled: !!userSlug,
  });

  // Infinite scroll observer
  useEffect(() => {
    if (!showAllEvents) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [showAllEvents, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all events from all pages
  const allEvents = data?.pages.flatMap((page) => dummy_events) || [];
  const firstPageEvents = dummy_events;
  const displayedEvents = showAllEvents
    ? allEvents
    : firstPageEvents.slice(0, 10);

  if (isLoading) {
    return (
      <div className='space-y-6 max-w-4xl mx-auto'>
        {Array.from({ length: 3 }).map((_, index) => (
          <EventCardSkeleton key={index} showActions={false} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6 max-w-4xl mx-auto'>
        <div className='text-center text-red-600'>
          <p>Failed to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!displayedEvents.length) {
    return (
      <div className='space-y-6 max-w-4xl mx-auto'>
        <div className='text-center text-gray-500 py-12'>
          <p>No events available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      {displayedEvents.map((event, idx) => (
        <EventCard
          key={event._id || idx}
          event={event}
          index={idx}
          theme={theme}
          isDashboard={false}
        />
      ))}

      {/* Show More Button */}
      {!showAllEvents && firstPageEvents.length > 10 && (
        <div className='text-center py-6'>
          <button
            onClick={() => setShowAllEvents(true)}
            className={`inline-flex items-center gap-2 px-6 py-3 bg-${theme.accent}-600 text-white rounded-lg font-semibold hover:bg-${theme.accent}-700 transition-colors`}
          >
            Show More Events
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
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>
      )}

      {/* Infinite Scroll Loading */}
      {showAllEvents && isFetchingNextPage && (
        <div className='space-y-6'>
          {Array.from({ length: 2 }).map((_, index) => (
            <EventCardSkeleton key={`loading-${index}`} showActions={false} />
          ))}
        </div>
      )}

      {/* Infinite Scroll Observer */}
      {showAllEvents && hasNextPage && (
        <div ref={observerRef} className='h-4' />
      )}
    </div>
  );
}

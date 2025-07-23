"use client";

import ShowMoreInfinite from "@/components/ShowMoreInfinite";
import { useEvents } from "@/lib/hooks/useEvents";
import { type Event } from "@/lib/youtube-utils";
import { useEffect, useRef } from "react";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";

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
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    allEvents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useEvents({ userSlug, limit: 5 });

  // Infinite scroll observer
  useEffect(() => {
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all events from all pages
  const displayedEvents = allEvents;

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
      <ShowMoreInfinite
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        buttonClassName={`bg-${theme.accent}-600 hover:bg-${theme.accent}-700`}
        className='space-y-4'
      >
        {displayedEvents.map((event, idx) => (
          <EventCard
            key={event._id || idx}
            event={event}
            index={idx}
            theme={theme}
            isDashboard={false}
          />
        ))}
        {/* Infinite Scroll Loading */}
        {isFetchingNextPage && (
          <div className='space-y-6'>
            {Array.from({ length: 2 }).map((_, index) => (
              <EventCardSkeleton key={`loading-${index}`} showActions={false} />
            ))}
          </div>
        )}
      </ShowMoreInfinite>
    </div>
  );
}

"use client";

import EventCard from "@/components/EventCard";
import EventModal from "@/components/modals/event-modal";
import ShowMoreInfinite from "@/components/ShowMoreInfinite";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useEvents } from "@/lib/hooks/useEvents";
import { type Event } from "@/lib/youtube-utils";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../EmptyState";
import EventCardSkeleton from "../EventCardSkeleton";
import { UpgradeModal } from "../modals/upgrade-modal";
import { THEMES } from "../templates/default";
import { EventsDashboardSkeleton } from "./EventsDashboardSkeleton";

export default function EventsDashboard() {
  const { data: user } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const {
    allEvents,
    totalEvents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents({ userSlug: user?.slug, limit: 5 });

  const handleSaveEvent = async (eventData: Event, formData?: FormData) => {
    try {
      if (editingEvent) {
        // Update existing event
        if (!formData) {
          throw new Error("FormData is required for updating events");
        }
        await updateEvent.mutateAsync({
          id: editingEvent._id!,
          formData,
        });

        setEditingEvent(null);
        toast("Event updated successfully!");
      } else {
        // Create new event with FormData (including file)
        if (!formData) {
          throw new Error("FormData is required for creating events");
        }

        await createEvent.mutateAsync(formData);
        toast("Event added successfully!", {
          description: "Your new event has been added.",
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to save event. Please try again.",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (eventToDelete: Event) => {
    try {
      await deleteEvent.mutateAsync(eventToDelete._id!);
      toast("Event deleted", {
        description: "The event has been removed.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast("Error", {
        description: "Failed to delete event. Please try again.",
      });
    }
  };

  const handleAddEvent = () => {
    if (user?.plan === "free" && allEvents?.length >= 2) {
      setUpgradeModalOpen(true);
    } else {
      setEditingEvent(null);
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <EventsDashboardSkeleton />;
  }

  // Get theme configuration
  const theme = THEMES[user?.theme as keyof typeof THEMES];

  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      <div className='flex flex-col items-start sm:flex-row gap-4 sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Events ({totalEvents || 0})
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Manage your speaking engagements and events
          </p>
        </div>

        <div className='flex items-center justify-end'>
          <Button
            onClick={handleAddEvent}
            className='bg-purple-600 hover:bg-purple-700 text-white'
          >
            <Plus className='w-4 h-4' />
            Add Event
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className='space-y-4'>
        {!allEvents || allEvents.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title='No events yet'
            description='Showcase your speaking experience by uploading past events. These will be featured on your public profile.'
            action={{
              label: "Add Event",
              onClick: handleAddEvent,
            }}
            className='text-center py-12'
          />
        ) : (
          <ShowMoreInfinite
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            buttonClassName={`bg-${theme.accent}-600 hover:bg-${theme.accent}-700`}
            className='space-y-4'
          >
            {allEvents.map((event, index) => (
              <EventCard
                key={event._id || index}
                event={event}
                index={index}
                isDashboard={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteEvent.isPending}
                theme={theme}
              />
            ))}
            {/* Infinite Scroll Loading */}
            {isFetchingNextPage && (
              <div className='space-y-6'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <EventCardSkeleton
                    key={`loading-${index}`}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </ShowMoreInfinite>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingEvent={editingEvent}
        onSave={handleSaveEvent}
        isLoading={createEvent.isPending || updateEvent.isPending}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </div>
  );
}

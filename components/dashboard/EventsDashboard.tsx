"use client";

import EventCard from "@/components/EventCard";
import EventModal from "@/components/modals/event-modal";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/lib/hooks/useEvents";
import { type Event } from "@/lib/youtube-utils";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EventsDashboardSkeleton } from "./EventsDashboardSkeleton";

interface EventsDashboardProps {
  initialEvents?: Event[];
}

export default function EventsDashboard({
  initialEvents = [],
}: EventsDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { events, isLoading, createEvent, updateEvent, deleteEvent } =
    useEvents();

  const handleSaveEvent = async (eventData: Event, formData?: FormData) => {
    try {
      if (editingEvent) {
        // Update existing event
        await updateEvent.mutateAsync({
          id: editingEvent._id!,
          eventData,
        });

        setEditingEvent(null);
        toast("Event updated successfully!", {
          description: "Your event has been updated.",
        });
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
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <EventsDashboardSkeleton />;
  }

  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Events Management ({events?.length || 0})
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
        {!events || events.length === 0 ? (
          <div className='text-center py-12'>
            <div className='flex flex-col items-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-gray-400' />
              </div>
              <div>
                <p className='text-gray-900 dark:text-white font-medium'>
                  No events yet
                </p>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  Start by adding your first speaking engagement
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {events.map((event, index) => (
              <EventCard
                key={event._id || index}
                event={event}
                index={index}
                isDashboard={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteEvent.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingEvent={editingEvent}
        onSave={handleSaveEvent}
        isLoading={createEvent.isPending || updateEvent.isPending}
      />
    </div>
  );
}

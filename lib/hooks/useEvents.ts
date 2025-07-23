import { type Event } from "@/lib/youtube-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

export function useEvents() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch all events
  const {
    data: events,
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users/events");
      return data.events || [];
    },
    enabled: !!session?.user?.id,
  });

  // Create event
  const createEvent = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axios.post("/api/users/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.error || "Failed to create event"
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Update event
  const updateEvent = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      try {
        const response = await axios.put(`/api/users/events/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.error || "Failed to update event"
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Delete event
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete(`/api/users/events/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.error || "Failed to delete event"
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}

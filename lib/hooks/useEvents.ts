import { type Event } from "@/lib/youtube-utils";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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

export function useEvents({
  userSlug,
  limit = 5,
}: {
  userSlug?: string;
  limit: number;
}) {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<PaginatedEventsResponse>({
    queryKey: ["events", userSlug, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `/api/users/${userSlug}/events?page=${pageParam}&limit=${limit}`;
      const { data } = await axios.get(url);
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled: !!userSlug,
  });

  // Flatten all events from all pages
  const allEvents = data?.pages.flatMap((page) => page.events) || [];
  const totalEvents = data?.pages[0].pagination.totalEvents || 0;

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
    totalEvents,
    allEvents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}

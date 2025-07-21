import { type Event } from "@/lib/youtube-utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

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

export function usePaginatedEvents(userSlug: string) {
  return useInfiniteQuery<PaginatedEventsResponse>({
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
}

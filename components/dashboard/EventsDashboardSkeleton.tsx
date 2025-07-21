import EventCardSkeleton from "@/components/EventCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsDashboardSkeleton() {
  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      {/* Header skeleton */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64 rounded-lg' />
          <Skeleton className='h-4 w-80 rounded-lg' />
        </div>
        <Skeleton className='h-10 w-32 rounded-lg' />
      </div>

      {/* Events list skeleton */}
      <div className='space-y-4'>
        {[1, 2, 3, 4].map((i) => (
          <EventCardSkeleton key={i} showActions={true} />
        ))}
      </div>
    </div>
  );
}

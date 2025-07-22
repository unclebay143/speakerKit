import { Skeleton } from "@/components/ui/skeleton";

interface EventCardSkeletonProps {
  showActions?: boolean;
}

export default function EventCardSkeleton({
  showActions = false,
}: EventCardSkeletonProps) {
  return (
    <div className='bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden'>
      <div className='flex flex-col md:flex-row h-auto md:h-64'>
        {/* Content Section */}
        <div className='flex-1 p-6 flex flex-col order-2 md:order-1'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-3'>
              <Skeleton className='w-8 h-8 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-16 rounded-full' />
            </div>

            {/* Action buttons skeleton - Only show if actions are enabled */}
            {showActions && (
              <div className='flex gap-2'>
                <Skeleton className='h-8 w-8 rounded' />
                <Skeleton className='h-8 w-8 rounded' />
              </div>
            )}
          </div>

          {/* Title */}
          <div className='mb-2'>
            <Skeleton className='h-6 w-3/4 mb-2' />
            <Skeleton className='h-6 w-1/2' />
          </div>

          {/* Description */}
          <Skeleton className='h-5 w-2/3 mb-3' />

          {/* Date and location */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-4 h-4 rounded' />
              <Skeleton className='h-4 w-24' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-4 h-4 rounded' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>

          {/* Button */}
          <div className='mt-auto'>
            <Skeleton className='h-10 w-32 rounded-lg' />
          </div>
        </div>

        {/* Image/Video Section */}
        <div className='w-full md:w-64 h-48 md:h-full flex-shrink-0 order-1 md:order-2 relative'>
          <Skeleton className='w-full h-full' />
        </div>
      </div>
    </div>
  );
}

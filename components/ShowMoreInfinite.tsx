import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ShowMoreInfiniteProps {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  children?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}

export default function ShowMoreInfinite({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  children,
  className = "",
  buttonClassName,
}: ShowMoreInfiniteProps) {
  const [infinite, setInfinite] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll logic (after first button click)
  useEffect(() => {
    if (!infinite || !hasNextPage) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [infinite, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className={className}>
      {children}
      {hasNextPage && !infinite && (
        <div className='text-center py-6'>
          <button
            onClick={() => {
              fetchNextPage();
              setInfinite(true);
            }}
            disabled={isFetchingNextPage}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors",
              buttonClassName
            )}
          >
            {isFetchingNextPage ? (
              "Loading..."
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
      )}
      {hasNextPage && infinite && <div ref={observerRef} className='h-4' />}
    </div>
  );
}

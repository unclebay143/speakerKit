import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

// Utility to parse string to Date
function parseDateString(
  dateString: string | Date | undefined
): Date | undefined {
  if (!dateString) return undefined;
  if (dateString instanceof Date) return dateString;
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

interface DatePickerProps {
  value?: string | Date;
  onChange: (dateString: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  error = false,
  disabled = false,
  className = "",
  minYear = 1900,
  maxYear = 2100,
}) => {
  // Robust ISO parsing
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    // Try ISO parse
    const iso = Date.parse(value);
    if (!isNaN(iso)) return new Date(iso);
    // Fallback to previous parse
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700",
            !selectedDate &&
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            error && "border-red-500",
            className
          )}
          disabled={disabled}
        >
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span className='text-gray-500 dark:text-gray-400'>
              {placeholder}
            </span>
          )}
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0 border border-zinc-200 dark:border-zinc-500'
        align='start'
      >
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={(date: Date | undefined) => {
            if (date) {
              onChange(date.toISOString());
            } else {
              onChange("");
            }
          }}
          captionLayout='dropdown'
          fromYear={minYear}
          toYear={maxYear}
        />
      </PopoverContent>
    </Popover>
  );
};

"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white dark:bg-black/95 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10",
            !date && "text-gray-500 dark:text-gray-400",
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 bg-white dark:bg-black/95 border-gray-200 dark:border-white/10'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className='bg-white dark:bg-black/95'
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-gray-900 dark:text-white",
            nav: "space-x-1 flex items-center",
            nav_button:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100 dark:bg-white/10 [&:has([aria-selected])]:bg-gray-100 dark:bg-white/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white",
            day_range_end: "day-range-end",
            day_selected:
              "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white",
            day_today:
              "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white",
            day_outside:
              "day-outside text-gray-400 dark:text-gray-500 aria-selected:bg-gray-100 dark:bg-white/10 aria-selected:text-gray-400 dark:text-gray-500",
            day_disabled: "text-gray-400 dark:text-gray-500 opacity-50",
            day_range_middle:
              "aria-selected:bg-gray-100 dark:bg-white/10 aria-selected:text-gray-900 dark:text-white",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

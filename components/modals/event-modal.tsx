"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventSchema, type EventFormData } from "@/lib/schemas/event-schema";
import { isYouTubeUrl, type Event } from "@/lib/youtube-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Edit, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// Utility function to parse date strings
const parseDateString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;

  // Try direct parsing first
  const directParse = new Date(dateString);
  if (!isNaN(directParse.getTime())) {
    return directParse;
  }

  // Try common date formats
  const formats = [
    "MMMM do, yyyy",
    "MMM do, yyyy",
    "MMMM d, yyyy",
    "MMM d, yyyy",
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "MMMM do yyyy",
    "MMM do yyyy",
  ];

  for (const formatStr of formats) {
    try {
      const parsed = parse(dateString, formatStr, new Date());
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return undefined;
};

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent?: Event | null;
  onSave: (event: Event, formData?: FormData) => void;
  isLoading?: boolean;
  isFreeUser?: boolean;
  eventCount?: number;
   maxFreeEvents?: number;
  onUpgrade?: () => void;
}

const EVENT_TYPES = [
  "Conference",
  "Meetup",
  "Workshop",
  "Podcast",
  "Interview",
  "Product Demo",
  "Webinar",
  "Panel Discussion",
  "Keynote",
  "Tutorial",
  "Playlist",
];

export default function EventModal({
  isOpen,
  onClose,
  editingEvent,
  onSave,
  isLoading = false,
  isFreeUser = false,
  eventCount = 0,
  maxFreeEvents = 2,
  onUpgrade,
}: EventModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  // Check if visual content requirement is met
  const hasVisualContent = () => {
    const hasImage =
      selectedFile || (editingEvent?.coverImage && !existingImageRemoved);
    const hasYouTubeVideo =
      watchedValues.youtubeVideo &&
      watchedValues.youtubeVideo.trim() !== "" &&
      isYouTubeUrl(watchedValues.youtubeVideo);
    const hasYouTubePlaylist =
      watchedValues.youtubePlaylist &&
      watchedValues.youtubePlaylist.trim() !== "" &&
      isYouTubeUrl(watchedValues.youtubePlaylist);

    return hasImage || hasYouTubeVideo || hasYouTubePlaylist;
  };

  // Reset form when modal opens/closes or editing event changes
  useEffect(() => {
    if (editingEvent) {
      reset({
        title: editingEvent.title,
        event: editingEvent.event,
        date: editingEvent.date,
        location: editingEvent.location,
        type: editingEvent.type,
        link: editingEvent.link,
        youtubeVideo: editingEvent.youtubeVideo || "",
        youtubePlaylist: editingEvent.youtubePlaylist || "",
        coverImage: editingEvent.coverImage,
      });
      // Try to parse the existing date - handle different date formats
      try {
        setSelectedDate(parseDateString(editingEvent.date));
      } catch {
        setSelectedDate(undefined);
      }
    } else {
      reset({
        title: "",
        event: "",
        date: "",
        location: "",
        type: "",
        link: "",
        youtubeVideo: "",
        youtubePlaylist: "",
        coverImage: "",
      });
      setSelectedDate(undefined);
    }
    setSelectedFile(null);
    setExistingImageRemoved(false);
  }, [editingEvent, isOpen, reset]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue("date", format(date, "MMMM do, yyyy"));
    } else {
      setValue("date", "");
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setValue("coverImage", file || "");

    // If we had an existing image and now no file is selected, mark it as removed
    if (!file && editingEvent?.coverImage && !existingImageRemoved) {
      setExistingImageRemoved(true);
      setValue("coverImage", "");
    } else if (file) {
      setExistingImageRemoved(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (isFreeUser && !editingEvent && eventCount >= maxFreeEvents) {
      toast.error("Free plan limited to 2 events. Upgrade to Pro for unlimited events.");
      onUpgrade?.();
      return;
    }
    setUploading(true);

    try {
      // Create FormData with all event data and file
      const formDataToSend = new FormData();
      formDataToSend.append("title", data.title);
      formDataToSend.append("event", data.event);
      formDataToSend.append("date", data.date);
      formDataToSend.append("location", data.location);
      formDataToSend.append("type", data.type);
      formDataToSend.append("link", data.link || "");
      formDataToSend.append("youtubeVideo", data.youtubeVideo || "");
      formDataToSend.append("youtubePlaylist", data.youtubePlaylist || "");

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("coverImage", selectedFile);
      } else if (editingEvent?.coverImage && !existingImageRemoved) {
        // If no new file is selected but there's an existing image and it wasn't removed, pass it as a string
        formDataToSend.append("coverImage", editingEvent.coverImage);
      }
      // If existingImageRemoved is true, we don't append anything, which will use the placeholder

      const eventData: Event = {
        ...editingEvent, // Preserve _id and other fields if editing
        title: data.title,
        event: data.event,
        date: data.date,
        location: data.location,
        type: data.type,
        coverImage: existingImageRemoved ? "" : editingEvent?.coverImage || "", // Clear if removed
        link: data.link || "",
        youtubeVideo: data.youtubeVideo || undefined,
        youtubePlaylist: data.youtubePlaylist || undefined,
      };

      onSave(eventData, formDataToSend);
    } catch (error) {
      console.error("Error saving event:", error);
      toast("Error", {
        description: "Failed to save event. Please try again.",
      });
    }

    setUploading(false);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black/95 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'>
        <div className='space-y-6'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
              {editingEvent ? (
                <Edit className='w-5 h-5' />
              ) : (
                <Plus className='w-5 h-5' />
              )}
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              {editingEvent
                ? "Update your event details"
                : "Add a new speaking engagement or event"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Event Title</Label>
                <Input
                  id='title'
                  {...register("title")}
                  placeholder='e.g., AI in Modern Software Engineering'
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='event'>Event Name</Label>
                <Input
                  id='event'
                  {...register("event")}
                  placeholder='e.g., Tech Conference 2024'
                  className={errors.event ? "border-red-500" : ""}
                />
                {errors.event && (
                  <p className='text-red-500 text-sm'>{errors.event.message}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='date'>Date</Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={handleDateChange}
                  placeholder='Select event date'
                />
                {errors.date && (
                  <p className='text-red-500 text-sm'>{errors.date.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  {...register("location")}
                  placeholder='e.g., San Francisco, CA'
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className='text-red-500 text-sm'>
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Event Type</Label>
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.type ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder='Select event type' />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className='text-red-500 text-sm'>{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='link'>Event Link</Label>
              <Input
                id='link'
                {...register("link")}
                placeholder='https://lu.ma/bfoo0cma'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='youtubeVideo'>YouTube Video URL</Label>
                <Input
                  id='youtubeVideo'
                  {...register("youtubeVideo")}
                  placeholder='https://youtu.be/NY6_2ozQilE'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='youtubePlaylist'>YouTube Playlist URL</Label>
                <Input
                  id='youtubePlaylist'
                  {...register("youtubePlaylist")}
                  placeholder='https://youtube.com/playlist?list=PL6kxQjlEC_5TfAmeC2UFOoGMYjKvtpXaa&si=kN-lqS-wR-bPyWuK'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 justify-between'>
                <Label htmlFor='coverImage'>Cover Image</Label>
                <span className='text-xs text-gray-500 dark:text-gray-400 ml-1'>
                  (JPG, PNG, WebP up to 10MB)
                </span>
              </div>

              <FileInput
                id='coverImage'
                onChange={handleFileChange}
                accept='image/jpeg,image/jpg,image/png,image/webp'
                label='Choose image file'
                existingImage={editingEvent?.coverImage}
              />
              {errors.coverImage && (
                <p className='text-red-500 text-sm'>
                  {errors.coverImage.message as string}
                </p>
              )}

              {/* Helper text */}
              <p
                className={`text-xs ${
                  hasVisualContent()
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {hasVisualContent()
                  ? "✓ Visual content requirement met"
                  : "Provide either a cover image or a valid YouTube video/playlist URL to ensure your event has visual content."}
              </p>
            </div>

            <div className='flex space-x-3'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={uploading}
                className='flex-1 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'
                disabled={uploading || isLoading || !isValid}
              >
                {uploading || isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : editingEvent ? (
                  "Update Event"
                ) : (
                  "Add Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ProfileImageSection() {
  const { data: user, refetch } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/users/image", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      toast("Profile image updated!");
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast("Failed to upload image", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/image", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      toast("Profile image removed!");
      refetch();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast("Failed to remove image", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          Profile Image
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Update your profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center space-x-6'>
          <div className='relative'>
            <Avatar className='w-24 h-24 relative'>
              {isLoading ? (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-black/40 rounded-full'>
                  <Spinner />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={
                      user?.image && user.image !== "/placeholder.svg"
                        ? user.image
                        : "/dark-placeholder.svg"
                    }
                    className={
                      !user?.image || user.image === "/placeholder.svg"
                        ? "opacity-80"
                        : ""
                    }
                  />
                  <AvatarFallback className='text-2xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400' />
                </>
              )}
            </Avatar>

            <div className='absolute -bottom-2 -right-2'>
              <label htmlFor='profile-image' className='cursor-pointer'>
                <div className='w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors'>
                  <Camera className='w-4 h-4 text-white' />
                </div>
                <input
                  id='profile-image'
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </label>
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='font-medium text-gray-900 dark:text-white mb-1'>
              Upload new picture
            </h3>
            <div className='flex space-x-2'>
              <label htmlFor='profile-image-btn'>
                <Button
                  variant='outline'
                  className='border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
                  asChild
                >
                  <span className='cursor-pointer'>
                    <Upload className='w-4 h-4' />
                    Upload Image
                  </span>
                </Button>
                <input
                  id='profile-image-btn'
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </label>
              <Button
                variant='outline'
                className='border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-500/10'
                onClick={handleDeleteImage}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileImageSection;

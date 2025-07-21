import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputWithPrefix } from "@/components/ui/input-with-prefix";
import { Label } from "@/components/ui/label";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SocialMediaSection() {
  const { data: user, refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to extract username from full URL
  const extractUsername = (url: string | undefined, platform: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      if (platform === "x" && urlObj.hostname === "x.com") {
        return urlObj.pathname.replace("/", "");
      }
      if (
        platform === "linkedin" &&
        urlObj.hostname === "linkedin.com" &&
        urlObj.pathname.startsWith("/in/")
      ) {
        return urlObj.pathname.replace("/in/", "");
      }
      if (platform === "instagram" && urlObj.hostname === "instagram.com") {
        return urlObj.pathname.replace("/", "");
      }
      return url;
    } catch {
      return url;
    }
  };

  // Set up react-hook-form
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      x: extractUsername(user?.socialMedia?.twitter, "x"),
      linkedin: extractUsername(user?.socialMedia?.linkedin, "linkedin"),
      instagram: extractUsername(user?.socialMedia?.instagram, "instagram"),
      email: user?.socialMedia?.email || user?.email || "",
    },
    mode: "onChange",
  });

  // Reset form when user data changes
  useEffect(() => {
    reset({
      x: extractUsername(user?.socialMedia?.twitter, "x"),
      linkedin: extractUsername(user?.socialMedia?.linkedin, "linkedin"),
      instagram: extractUsername(user?.socialMedia?.instagram, "instagram"),
      email: user?.socialMedia?.email || user?.email || "",
    });
  }, [user, reset]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    const socialMedia = {
      twitter: values.x ? `https://x.com/${values.x}` : "",
      linkedin: values.linkedin
        ? `https://linkedin.com/in/${values.linkedin}`
        : "",
      instagram: values.instagram
        ? `https://instagram.com/${values.instagram}`
        : "",
      email: values.email || "",
    };

    try {
      await updateUser.mutateAsync({ socialMedia });
      toast("Social media updated!", {
        description: "Your social media links have been updated.",
      });
      refetch();
      reset(values); // Reset form dirty state
    } catch (e) {
      toast("Failed to update social media", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          Social Media Links
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Update your social media profiles
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='x' className='text-gray-900 dark:text-white'>
              X (Twitter)
            </Label>
            <InputWithPrefix
              id='x'
              prefix='x.com/'
              placeholder='yourhandle'
              {...register("x")}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='linkedin' className='text-gray-900 dark:text-white'>
              LinkedIn
            </Label>
            <InputWithPrefix
              id='linkedin'
              prefix='linkedin.com/in/'
              placeholder='yourprofile'
              {...register("linkedin")}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label
              htmlFor='instagram'
              className='text-gray-900 dark:text-white'
            >
              Instagram
            </Label>
            <InputWithPrefix
              id='instagram'
              prefix='instagram.com/'
              placeholder='yourhandle'
              {...register("instagram")}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='email' className='text-gray-900 dark:text-white'>
              Contact Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='your@email.com'
              {...register("email")}
            />
          </div>
          <div className='md:col-span-2 flex justify-end'>
            <Button
              type='submit'
              disabled={isLoading || !formState.isDirty}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              {isLoading ? "Saving..." : "Save Social Links"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

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
import { useState } from "react";

export default function SocialMediaSection() {
  const { data: user, refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<null | {
    text: string;
    type: "success" | "error";
  }>(null);

  console.log(user);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const socialMedia = {
      twitter: (formData.get("x") as string)
        ? `https://x.com/${formData.get("x")}`
        : "",
      linkedin: (formData.get("linkedin") as string)
        ? `https://linkedin.com/in/${formData.get("linkedin")}`
        : "",
      instagram: (formData.get("instagram") as string)
        ? `https://instagram.com/${formData.get("instagram")}`
        : "",
      email: (formData.get("email") as string) || "",
    };

    try {
      await updateUser.mutateAsync({ socialMedia });
      setMessage({ text: "Social media updated!", type: "success" });
      refetch();
    } catch (e) {
      setMessage({ text: "Failed to update social media", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          {message && (
            <div
              className={`text-sm p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='x' className='text-gray-900 dark:text-white'>
              X (Twitter)
            </Label>
            <InputWithPrefix
              id='x'
              name='x'
              prefix='x.com/'
              defaultValue={extractUsername(user.socialMedia?.twitter, "x")}
              placeholder='yourhandle'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='linkedin' className='text-gray-900 dark:text-white'>
              LinkedIn
            </Label>
            <InputWithPrefix
              id='linkedin'
              name='linkedin'
              prefix='linkedin.com/in/'
              defaultValue={extractUsername(
                user.socialMedia?.linkedin,
                "linkedin"
              )}
              placeholder='yourprofile'
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='instagram'
              className='text-gray-900 dark:text-white'
            >
              Instagram
            </Label>
            <InputWithPrefix
              id='instagram'
              name='instagram'
              prefix='instagram.com/'
              defaultValue={extractUsername(
                user.socialMedia?.instagram,
                "instagram"
              )}
              placeholder='yourhandle'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-gray-900 dark:text-white'>
              Contact Email
            </Label>
            <Input
              id='email'
              name='email'
              defaultValue={user.socialMedia?.email || user.email || ""}
              placeholder='your@email.com'
              type='email'
            />
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isLoading}
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

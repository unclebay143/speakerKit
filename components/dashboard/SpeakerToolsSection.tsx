"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { Check, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AVAILABLE_TOOLS = [
  {
    key: "notion",
    name: "Notion",
    description: "Note-taking and organization",
  },
  { key: "canva", name: "Canva", description: "Design and presentation" },
  { key: "google-docs", name: "Google Docs", description: "Document creation" },
  { key: "figma", name: "Figma", description: "Design and prototyping" },
  {
    key: "powerpoint",
    name: "PowerPoint",
    description: "Microsoft presentations",
  },
];

export default function SpeakerToolsSection() {
  const { data: user } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [selectedTools, setSelectedTools] = useState<string[]>(
    user?.tools || []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update selected tools when user data loads
  useEffect(() => {
    if (user?.tools) {
      setSelectedTools(user.tools);
    }
  }, [user?.tools]);

  const handleToolToggle = (toolKey: string) => {
    setSelectedTools((prev) => {
      if (prev.includes(toolKey)) {
        return prev.filter((tool) => tool !== toolKey);
      } else {
        // Limit to 5 tools maximum
        if (prev.length >= 5) {
          toast(
            "You can only select up to 5 tools to display on your profile.",
            {
              description: "Please try again.",
            }
          );
          return prev;
        }
        return [...prev, toolKey];
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      await updateUser.mutateAsync({ tools: selectedTools });
      toast("Speaker tools updated successfully!");
    } catch (error) {
      console.error("Error updating speaker tools:", error);

      toast("Failed to update speaker tools.", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isChanged =
    JSON.stringify(selectedTools) !== JSON.stringify(user?.tools || []);

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          <Wrench className='w-5 h-5' />
          Speaker Tools
          <Badge variant='secondary' className='text-xs'>
            {selectedTools.length}/5
          </Badge>
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Select the tools you use as a speaker. These will be displayed on your
          profile.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {AVAILABLE_TOOLS.map((tool) => (
            <div
              key={tool.key}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTools.includes(tool.key)
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 ring-2 ring-purple-200 dark:ring-purple-800"
                  : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
              }`}
              onClick={() => handleToolToggle(tool.key)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <h4 className='font-medium text-sm text-gray-900 dark:text-white'>
                    {tool.name}
                  </h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {tool.description}
                  </p>
                </div>
                <div className='ml-2'>
                  {selectedTools.includes(tool.key) && (
                    <Check className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end pt-4'>
          <Button
            onClick={handleSave}
            disabled={isLoading || !isChanged}
            className='bg-purple-600 hover:bg-purple-700 text-white'
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

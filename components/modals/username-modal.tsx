"use client";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { UsernameForm } from "@/components/ui/username-form";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";

interface UsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function UsernameModal({
  open,
  onOpenChange,
  onComplete,
}: UsernameModalProps) {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (username: string) => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error("Failed to complete onboarding");
        }

        await update({
          username: username,
          hasCompletedOnboarding: true,
        });

        onOpenChange(false);

        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error("Error completing onboarding:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [update, onOpenChange, onComplete]
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const heading = "Set Up Your Profile";
  const description =
    "Choose a unique username to create your profile URL. Note: This will be used for for your public profile";

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      heading={heading}
      description={description}
      className='max-w-md'
    >
      <div className='px-4'>
        <UsernameForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </ResponsiveModal>
  );
}

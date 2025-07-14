

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import debounce from "lodash.debounce";
import { AlertCircle, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface UsernameFormProps {
  onSubmit: (username: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function UsernameForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: UsernameFormProps) {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const debouncedCheck = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.length < 3) {
          setIsAvailable(null);
          return;
        }

        try {
          setIsChecking(true);
          const response = await fetch("/api/username/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: value }),
          });
          const data = await response.json();
          setIsAvailable(data.available);
        } catch (error) {
          console.error("Error checking username:", error);
          setIsAvailable(false);
        } finally {
          setIsChecking(false);
        }
      }, 500),
    []
  );

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setUsername(sanitized);

    debouncedCheck.cancel();

    if (sanitized.length >= 3) {
      debouncedCheck(sanitized);
    } else {
      setIsAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !isAvailable) return;

    await onSubmit(username);
    setUsername("");
  };

  const handleCancel = () => {
    setUsername("");
    onCancel?.();
  };

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='username' className='text-gray-900 dark:text-white'>
            Username
          </Label>
          <div className='relative'>
            <div className='absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none'>
              <span className='text-gray-500 dark:text-gray-400'>
                speakerkit.com/
              </span>
            </div>
            <Input
              id='username'
              placeholder=''
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className='bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pl-32'
              required
              minLength={3}
              maxLength={30}
            />
            {username.length >= 3 && (
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                {isAvailable === true && (
                  <Check className='w-4 h-4 text-green-600 dark:text-green-400' />
                )}
                {isAvailable === false && (
                  <AlertCircle className='w-4 h-4 text-red-600 dark:text-red-400' />
                )}
              </div>
            )}
          </div>
          {username.length >= 3 && (
            <p
              className={`text-xs ${
                isAvailable === true
                  ? "text-green-600 dark:text-green-400"
                  : isAvailable === false
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {isAvailable === true && "✓ Username is available"}
              {isAvailable === false && "✗ Username is already taken"}
              {isAvailable === null && "Checking availability..."}
            </p>
          )}
        </div>

        <div className='text-xs text-gray-500 dark:text-gray-400 space-y-1'>
          <p>• Username must be 3-30 characters long</p>
          <p>• Only letters, numbers, and hyphens allowed</p>
          <p>• Cannot start or end with a hyphen</p>
        </div>
      </form>

      {/* Action Buttons */}
      <div className='flex space-x-3'>
        {onCancel && (
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            className='flex-1 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10'
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!username || !isAvailable || isLoading}
          className={`${
            onCancel ? "flex-1" : "w-full"
          } bg-purple-600 hover:bg-purple-700 text-white`}
        >
          {isLoading ? "Completing..." : "Complete onboarding 🎉"}
        </Button>
      </div>
    </div>
  );
}

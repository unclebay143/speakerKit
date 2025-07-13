"use client";

import type React from "react";

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
import debounce from "lodash.debounce";
import { Camera, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import PasswordSection from "./PasswordSection";
import ProfileInfoSection from "./ProfileInfoSection";
import ThemeSection from "./ThemeSection";
import VisibilitySection from "./VisibilitySection";

export function Settings() {
  const { data: user, isLoading: userLoading, refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [profileImage, setProfileImage] = useState(user?.image);
  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null;
    loading: boolean;
    error: string | null;
    isEdited: boolean;
  }>({
    available: null,
    loading: false,
    error: null,
    isEdited: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [accountVisibility, setAccountVisibility] = useState({
    isPublic: true,
  });

  const [selectedTheme, setSelectedTheme] = useState("teal");

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    access: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus((prev) => ({
        ...prev,
        available: null,
        loading: false,
        error:
          username.length > 0 ? "Username must be at least 3 characters" : null,
      }));
      return;
    }

    setUsernameStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/username/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to check username");
      }

      const data = await response.json();
      setUsernameStatus({
        available: data.available,
        loading: false,
        error: null,
        isEdited: true,
      });
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameStatus((prev) => ({
        ...prev,
        available: null,
        loading: false,
        error: "Error checking username availability",
        isEdited: true,
      }));
    }
  }, []);

  const debouncedCheck = useMemo(
    () => debounce(checkUsernameAvailability, 500),
    [checkUsernameAvailability]
  );

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setAccountData((prev) => ({ ...prev, username: sanitized }));
    if (sanitized !== user?.username) {
      debouncedCheck(sanitized);
    } else {
      setUsernameStatus({
        available: true,
        loading: false,
        error: null,
        isEdited: false,
      });
    }
  };

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ image: file }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setProfileImage(data.user.image);
      setMessage({ text: "Profile image updated!", type: "success" });
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountUpdate = async () => {
    if (
      accountData.username !== user?.username &&
      (usernameStatus.available === false || usernameStatus.loading)
    ) {
      setMessage({
        text: "Please choose an available username",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      await updateUser.mutateAsync({
        name: accountData.fullName,
        username: accountData.username,
        isPublic: accountVisibility.isPublic,
      });

      setMessage({ text: "Account updated successfully!", type: "success" });
      refetch();
    } catch (error) {
      console.error("Error updating account:", error);
      setMessage({ text: "Failed to update account", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ text: "Password updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({ text: "Failed to update password", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUser.mutateAsync({ isPublic: accountVisibility.isPublic });
      setMessage({ text: "Visibility settings updated!", type: "success" });
      refetch();
    } catch (error) {
      console.error("Error updating visibility:", error);
      setMessage({ text: "Failed to update visibility", type: "error" });
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

      setProfileImage(undefined);
      setMessage({ text: "Profile image removed!", type: "success" });
      refetch();
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage({ text: "Failed to remove image", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUser.mutateAsync({ theme: selectedTheme });
      setMessage({ text: "Theme updated successfully!", type: "success" });
      refetch();
    } catch (error) {
      console.error("Error updating theme:", error);
      setMessage({ text: "Failed to update theme", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileImage((prev: string | undefined) => {
        const sessionImage = user.image || "/placeholder.svg";
        return prev !== sessionImage ? sessionImage : prev;
      });

      setAccountData({
        fullName: user.name || "",
        email: user.email || "",
        username: user.username || "",
      });
      setAccountVisibility({
        isPublic: user.isPublic !== false,
      });

      // Set theme from session, default to "teal" if not set
      const sessionTheme = user.theme || "teal";
      setSelectedTheme(sessionTheme);

      setUsernameStatus({
        available: true,
        loading: false,
        error: null,
        isEdited: false,
      });
    }
  }, [user]);

  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-200 dark:border-green-800"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className='float-right font-bold'
          >
            ×
          </button>
        </div>
      )}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Account Settings
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your account preferences and security settings
        </p>
      </div>

      <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
            {/* <Camera className='w-5 h-5' /> */}
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
                        profileImage && profileImage !== "/placeholder.svg"
                          ? profileImage
                          : "/dark-placeholder.svg"
                      }
                      className={
                        !profileImage || profileImage === "/placeholder.svg"
                          ? "opacity-80"
                          : ""
                      }
                    />
                    <AvatarFallback className='text-2xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "US"}
                    </AvatarFallback>
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

      {/* Account Information */}
      <ProfileInfoSection />
      <ThemeSection />
      <VisibilitySection />
      <PasswordSection />
    </div>
  );
}

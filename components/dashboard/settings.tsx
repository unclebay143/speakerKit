"use client";

import type React from "react";

import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import PasswordSection from "./PasswordSection";
import ProfileImageSection from "./ProfileImageSection";
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

      const response = await fetch("/api/users/image", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setProfileImage(data.image);
      setMessage({ text: "Profile image updated!", type: "success" });
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ text: "Failed to upload image", type: "error" });
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

      <ProfileImageSection />

      {/* Account Information */}
      <ProfileInfoSection />
      <ThemeSection />
      <VisibilitySection />
      <PasswordSection />
    </div>
  );
}

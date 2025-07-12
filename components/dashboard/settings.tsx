"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Camera,
  Check,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Save,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import debounce from "lodash.debounce";


export function Settings() {
  const { data: session, update } = useSession();
  
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [profileImage, setProfileImage] = useState(
    session?.user?.image 
  );
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
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [socialMedia, setSocialMedia] = useState({
    twitter: session?.user?.socialMedia?.twitter || '',
    linkedin: session?.user?.socialMedia?.linkedin || '',
    instagram: session?.user?.socialMedia?.instagram || '',
    email: session?.user?.email || ''
  });

  const [accountVisibility, setAccountVisibility] = useState({
    isPublic: true,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    access: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isVisibilityLoading, setIsVisibilityLoading] = useState(false);

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus(prev => ({
        ...prev,
        available: null,
        loading: false,
        error: username.length > 0 ? "Username must be at least 3 characters" : null
      })
      );
      return;
    }

    setUsernameStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/username/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to check username');
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
      setUsernameStatus(prev => ({
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
    setAccountData(prev => ({ ...prev, username: sanitized }));
     if (sanitized !== session?.user?.username) {
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

    setIsImageLoading(true);
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

      // await update({
      //   image: data.image,
      // });
      
      await update({
        ...session?.user,
        image: data.image,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleAccountUpdate = async () => {
    if (accountData.username !== session?.user?.username && 
        (usernameStatus.available === false || usernameStatus.loading)) {
      setMessage({ 
        text: "Please choose an available username", 
        type: "error" 
      });
      return;
    }
    setIsAccountLoading(true);
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: accountData.fullName,
          username: accountData.username,
          isPublic: accountVisibility.isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update account");
      }

      const needsSessionUpdate = 
      session?.user?.name !== accountData.fullName ||
      session?.user?.username !== accountData.username ||
      session?.user?.isPublic !== accountVisibility.isPublic;

    if (needsSessionUpdate) {
      await update({
        ...session?.user,
        name: accountData.fullName,
        username: accountData.username,
        isPublic: accountVisibility.isPublic,
      });
    }

    setMessage({ text: "Account updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating account:", error);
      setMessage({ text: "Failed to update account", type: "error" });
    } finally {
     setIsAccountLoading(true);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsPasswordLoading(false);
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update password");
      }
      setMessage({ text: "Password updated successfully!", type: "success" });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleVisibilityUpdate = async () => {
    setIsVisibilityLoading(true);
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: accountVisibility.isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

       if (session?.user?.isPublic !== accountVisibility.isPublic) {
      await update({
        ...session?.user,
        isPublic: accountVisibility.isPublic,
      });
    }

    setMessage({ text: "Visibility settings updated!", type: "success" });
    } catch (error) {
      console.error("Error updating visibility:", error);
      setMessage({ text: "Failed to update visibility", type: "error" });
    } finally {
      setIsVisibilityLoading(true);
    }
  };
  const handleDeleteImage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/image", { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setProfileImage(data.image);
        setMessage({ text: "Image removed successfully!", type: "success" });
        await update({
          ...session?.user,
          image: data.image,
        });
      } else {
        setMessage({ text: data.error || "Failed to remove image", type: "error" });
      }
    } catch (error) {
      console.error("Error removing image:", error);
      setMessage({ text: "An error occurred while removing the image", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialMediaUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialMedia: {
            twitter: socialMedia.twitter,
            linkedin: socialMedia.linkedin,
            instagram: socialMedia.instagram,
            email: socialMedia.email
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to update social media");

      await update({
        ...session?.user,
        socialMedia: {
          twitter: socialMedia.twitter,
          linkedin: socialMedia.linkedin,
          instagram: socialMedia.instagram,
          email: socialMedia.email
        }
      });

      setMessage({ text: "Social media updated!", type: "success" });
    } catch (error) {
      console.error("Error updating social media:", error);
      setMessage({ text: "Failed to update social media", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
  if (session?.user) {
    setProfileImage((prev) => {
      const sessionImage = session.user.image || "/placeholder.svg";
      return prev !== sessionImage ? sessionImage : prev;
    });

      setAccountData({
        fullName: session.user.name || "",
        email: session.user.email || "",
        username: session.user.username || "",
      });
      setSocialMedia({
        twitter: session.user.socialMedia?.twitter || '',
        linkedin: session.user.socialMedia?.linkedin || '',
        instagram: session.user.socialMedia?.instagram || '',
        email: session.user.email || ''
      });

      setAccountVisibility({
        isPublic: session.user.isPublic !== false,
      });

      setUsernameStatus({
        available: true,
        loading: false,
        error: null,
        isEdited: false,
      });
    }
  }, [session]);

  return (
    <div className='space-y-6 mx-auto max-w-screen-lg'>
      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900 text-green-100"
              : "bg-red-900 text-red-100"
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
        <h2 className='text-2xl font-bold text-white mb-2'>Account Settings</h2>
        <p className='text-gray-400'>
          Manage your account preferences and security settings
        </p>
      </div>

      <Card className='bg-black/40 border-white/10'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Camera className='w-5 h-5' />
            Profile Image
          </CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-6'>
            <div className='relative'>
              <Avatar className='w-24 h-24 relative'>
                {isImageLoading ? (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full'>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <AvatarImage 
                      src={profileImage && profileImage !== "/placeholder.svg" ? profileImage : "/dark-placeholder.svg"} 
                      className={!profileImage || profileImage === "/placeholder.svg" ? "opacity-80" : ""}
                    />
                    <AvatarFallback className='bg-gray-800 text-gray-400 text-2xl'>
                      {session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'US'}
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
              <h3 className='text-white font-medium mb-1'>
                Upload new picture
              </h3>
              <div className='flex space-x-2'>
                <label htmlFor='profile-image-btn'>
                  <Button
                    variant='outline'
                    className='border-white/10 text-white bg-transparent'
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
                  className='border-red-500/30 text-red-400 bg-transparent hover:bg-red-500/10'
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
      <Card className='bg-black/40 border-white/10'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <User className='w-5 h-5' />
            Account Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='fullName' className='text-white'>
                Full Name
              </Label>
              <Input
                id='fullName'
                value={accountData.fullName}
                onChange={(e) =>
                  setAccountData({ ...accountData, fullName: e.target.value })
                }
                className='bg-white/5 border-white/10 text-white'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='username' className='text-white'>
                Username
              </Label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none'>
                  <span className='text-gray-400'>speakerkit.com/</span>
                </div>
                 <Input
                  id='username'
                  value={accountData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className='bg-white/5 border-white/10 text-white pl-32'
                />
                 {usernameStatus.isEdited && accountData.username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus.loading ? (
                      <Spinner className="w-1 h-1" />
                    ) : usernameStatus.available === true ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : usernameStatus.available === false ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : null}
                  </div>
                )}
              </div>
               {(usernameStatus.isEdited || usernameStatus.error) && (
                <p className={`text-xs ${
                  usernameStatus.loading ? "text-gray-600" :
                  usernameStatus.available === true ? "text-green-400" : 
                  usernameStatus.available === false ? "text-red-400" : 
                  usernameStatus.error ? "text-red-400" : "text-gray-400"
                }`}>
                  {usernameStatus.loading && "Checking availability..."}
                  {!usernameStatus.loading && usernameStatus.available === true && "✓ Username is available"}
                  {!usernameStatus.loading && usernameStatus.available === false && "✗ Username is already taken"}
                  {usernameStatus.error && usernameStatus.error}
                  {!usernameStatus.loading && 
                   usernameStatus.available === null && 
                   !usernameStatus.error && 
                   accountData.username.length > 0 && 
                   accountData.username.length < 3 && "Username must be at least 3 characters"}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-white'>
              Email Address
            </Label>
            <Input
              id='email'
              type='email'
              value={accountData.email}
              onChange={(e) =>
                setAccountData({ ...accountData, email: e.target.value })
              }
              className='bg-white/5 border-white/10 text-white'
            />
          </div>
          <div className='flex justify-end'>
            <Button
              onClick={handleAccountUpdate}
              disabled={isAccountLoading}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Save className='w-4 h-4' />
              {isAccountLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Info */}
      <Card className='bg-black/40 border-white/10'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Globe className='w-5 h-5' />
            Social Media Links
          </CardTitle>
          <CardDescription>Update your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='twitter' className='text-white'>
                Twitter
              </Label>
              <Input
                id='twitter'
                placeholder="https://twitter.com/janet"
                value={socialMedia.twitter}
                onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
                className='bg-white/5 border-white/10 text-white'
              />
            </div>
            
            <div className='space-y-2'>
              <Label htmlFor='linkedin' className='text-white'>
                LinkedIn
              </Label>
              <Input
                id='linkedin'
                placeholder="https://linkedin.com/in/janet"
                value={socialMedia.linkedin}
                onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})}
                className='bg-white/5 border-white/10 text-white'
              />
            </div>
            
            <div className='space-y-2'>
              <Label htmlFor='instagram' className='text-white'>
                Instagram
              </Label>
              <Input
                id='instagram'
                placeholder="https://instagram.com/janet"
                value={socialMedia.instagram}
                onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                className='bg-white/5 border-white/10 text-white'
              />
            </div>
            
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-white'>
                Contact Email
              </Label>
              <Input
                id='email'
                type="email"
                placeholder="your@email.com"
                value={socialMedia.email}
                onChange={(e) => setSocialMedia({...socialMedia, email: e.target.value})}
                className='bg-white/5 border-white/10 text-white'
              />
            </div>
          </div>
          
          <div className='flex justify-end'>
            <Button
              onClick={handleSocialMediaUpdate}
              disabled={isLoading}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Save className='w-4 h-4' />
              {isLoading ? "Saving..." : "Save Social Links"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className='bg-black/40 border-white/10'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Lock className='w-5 h-5' />
            Update Password
          </CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='currentPassword' className='text-white'>
              Current Password
            </Label>
            <div className='relative'>
              <Input
                id='currentPassword'
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className='bg-white/5 border-white/10 text-white pr-10'
                placeholder='Enter current password'
              />
              <button
                type='button'
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white'
              >
                {showPasswords.current ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='newPassword' className='text-white'>
                New Password
              </Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className='bg-white/5 border-white/10 text-white pr-10'
                  placeholder='Enter new password'
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white'
                >
                  {showPasswords.new ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword' className='text-white'>
                Confirm New Password
              </Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className='bg-white/5 border-white/10 text-white pr-10'
                  placeholder='Confirm new password'
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white'
                >
                  {showPasswords.confirm ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              onClick={handlePasswordUpdate}
              disabled={
                isPasswordLoading ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Lock className='w-4 h-4' />
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Visibility */}
      <Card className='bg-black/40 border-white/10'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Shield className='w-5 h-5' />
            Account Visibility
          </CardTitle>
          <CardDescription>Control who can view your profiles</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Public/Private Toggle */}
          <div className='flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10'>
            <div className='flex items-center space-x-3'>
              {accountVisibility.isPublic ? (
                <Eye className='w-5 h-5 text-green-400' />
              ) : (
                <Lock className='w-5 h-5 text-orange-400' />
              )}
              <div>
                <Label className='text-white'>Profile Visibility</Label>
                <p className='text-sm text-gray-400'>
                  {accountVisibility.isPublic
                    ? "Your profiles are publicly accessible"
                    : "Your profiles are private and hidden from public view"}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Badge
                variant={accountVisibility.isPublic ? "default" : "secondary"}
              >
                {accountVisibility.isPublic ? "Visible" : "Hidden"}
              </Badge>
              <Switch
                checked={accountVisibility.isPublic}
                onCheckedChange={(checked) =>
                  setAccountVisibility({
                    ...accountVisibility,
                    isPublic: checked,
                  })
                }
              />
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              onClick={handleVisibilityUpdate}
              disabled={isVisibilityLoading}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Shield className='w-4 h-4' />
              {isLoading ? "Saving..." : "Save Visibility Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

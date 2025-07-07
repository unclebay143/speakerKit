"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User,  Lock, Eye, EyeOff, Shield, Save, Upload, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useSession } from "next-auth/react"
import { Spinner } from "../ui/spinner"

export function Settings() {
  const { data: session, update } = useSession();
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const [profileImage, setProfileImage] = useState(session?.user?.image || "/placeholder.svg");
  const [accountData, setAccountData] = useState({
        fullName: "",
        email: "",
        username: "",
    });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [accountVisibility, setAccountVisibility] = useState({
    isPublic: true,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    access: false,
  })
  const [isLoading, setIsLoading] = useState(false)

 const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/users/image', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setProfileImage(data.image);
      setMessage({ text: 'Profile image updated!', type: 'success' });
      await update({
        ...session?.user,
        image: data.image
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };


   const handleAccountUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: accountData.fullName,
          username: accountData.username,
          isPublic: accountVisibility.isPublic
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      // const data = await response.json();
      setMessage({ text: 'Account updated successfully!', type: 'success' });
      await update({
        ...session?.user,
        name: accountData.fullName,
        username: accountData.username,
        isPublic: accountVisibility.isPublic,
        image: session?.user?.image 
      });
    } catch (error) {
      console.error("Error updating account:", error);
      setMessage({ text: 'Failed to update account', type: 'error' });
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
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
      setMessage({ text: 'Password updated successfully!', type: 'success' });

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isPublic: accountVisibility.isPublic
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update visibility');
            }

            setMessage({ text: 'Visibility settings updated!', type: 'success' });
            
            await update({
                ...session?.user,
                isPublic: accountVisibility.isPublic
            });
        } catch (error) {
            console.error("Error updating visibility:", error);
            setMessage({ text: 'Failed to update visibility', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
   useEffect(() => {
    if (session?.user) {
        setProfileImage(session.user.image || "/placeholder.svg");
        setAccountData({
            fullName: session.user.name || "",
            email: session.user.email || "",
            username: session.user.username || "",
        });
        setAccountVisibility({
            isPublic: session.user.isPublic !== false,
        });
    }
    }, [session]);

  return (
    <div className="space-y-6 mx-auto max-w-screen-lg">
      {message && (
        <div className={`p-4 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
          {message.text}
          <button 
            onClick={() => setMessage(null)} 
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400">Manage your account preferences and security settings</p>
      </div>

       <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Profile Image
          </CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24 relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <Spinner /> 
                  </div>
                ) : (
                  <>
                    <AvatarImage src={profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-purple-600 text-white text-2xl">MJ</AvatarFallback>
                  </>
                )}
              </Avatar>

              <div className="absolute -bottom-2 -right-2">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Upload new picture</h3>
              <div className="flex space-x-2">
                <label htmlFor="profile-image-btn">
                  <Button variant="outline" className="border-white/10 text-white bg-transparent" asChild>
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                  <input
                    id="profile-image-btn"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 bg-transparent hover:bg-red-500/10"
                  onClick={() => setProfileImage("/placeholder.svg?height=120&width=120")}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={accountData.fullName}
                onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <span className="text-gray-400">speakerkit.com/</span>
                </div>
                <Input
                  id="username"
                  value={accountData.username}
                  onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                  className="bg-white/5 border-white/10 text-white pl-32"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAccountUpdate}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Update Password
          </CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-white/5 border-white/10 text-white pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-white/5 border-white/10 text-white pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-white/5 border-white/10 text-white pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handlePasswordUpdate}
              disabled={
                isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword
              }
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Visibility */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Visibility
          </CardTitle>
          <CardDescription>Control who can view your profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              {accountVisibility.isPublic ? (
                <Eye className="w-5 h-5 text-green-400" />
              ) : (
                <Lock className="w-5 h-5 text-orange-400" />
              )}
              <div>
                <Label className="text-white">Profile Visibility</Label>
                <p className="text-sm text-gray-400">
                  {accountVisibility.isPublic
                    ? "Your profiles are publicly accessible"
                    : "Your profiles are private and hidden from public view"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={accountVisibility.isPublic ? "default" : "secondary"}>
                {accountVisibility.isPublic ? "Visible" : "Hidden"}
              </Badge>
              <Switch
                checked={accountVisibility.isPublic}
                onCheckedChange={(checked) => setAccountVisibility({ ...accountVisibility, isPublic: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleVisibilityUpdate}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Visibility Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

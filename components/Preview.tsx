"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Globe, MapPin, Folder, Image as  Clock, ChevronRight, Mail, ImageIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Profile {
  _id: string;
  title: string;
  shortBio: string;
  mediumBio?: string;
  longBio?: string;
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
}

interface Folder {
  _id: string;
  name: string;
  description: string;
  images: {
    _id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

interface UserData {
  name: string;
  email: string;
  image: string;
  location: string;
  createdAt: string;
  website: string;
  country: string;
}

export default function ProfilePreview() {
  const { username } = useParams();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const userRes = await fetch(`/api/users/${username}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUserData(userData);

        const profilesRes = await fetch(`/api/users/${username}/profiles`);
        if (!profilesRes.ok) throw new Error("Failed to fetch profiles");
        const profilesData = await profilesRes.json();

        setProfiles(profilesData);
        if (profilesData.length > 0) {
          setActiveProfile(profilesData[0]._id);
        }

        const foldersRes = await fetch(`/api/users/${username}/folders`);
        if (!foldersRes.ok) throw new Error("Failed to fetch folders");
        const foldersData = await foldersRes.json();
        setFolders(foldersData);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const getActiveProfile = () => {
    const publicProfiles = profiles.filter(profile => profile.isPublic);
    return publicProfiles.find(profile => profile._id === activeProfile) || profiles[0];
  };

  const getSelectedFolder = () => {
    return folders.find(folder => folder._id === selectedFolder);
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-white text-center py-10">{error}</div>;
  }
 if (!userData) {
    return <div className="text-white text-center py-10">User not found</div>;
  }


  return (
    <div className="bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 ">
      <div className="space-y-6 mx-auto max-w-[1100px] py-10">
        <div className="flex items-start gap-6 bg-black/40 p-6 py-10 rounded-xl">
          <Avatar className="h-32 w-32 border-2 border-white/30">
            <AvatarImage src={userData.image || "/profile-picture.jpg"} />
            <AvatarFallback>
              {userData.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
            <div className="text-gray-300 flex items-center space-x-7 space-y-1">
              <p className="flex text-gray-400 gap-2">
                <span><MapPin /></span>{userData.location || "Location not specified"}
              </p>
              
                 <p className="flex text-gray-400 gap-2">
                    <span><Calendar /></span>
                    Joined {userData.createdAt ? format(new Date(userData.createdAt), "MMMM d, yyyy") : "Date not available"}
                </p>


              <p className="flex text-gray-400 gap-2">
                <span><Globe /></span>{userData.website || "No website"}
              </p>
             
            </div>

            <div className="flex items-center mt-4 space-x-4 ">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">{userData.country || "Country not specified"}</p>
               <p className="flex items-center text-gray-400 text-sm gap-2">
                <span><Mail className="h-4 w-4"/></span>{userData.email || "No email provided"}
              </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 my-4"></div>

        {/* Speaker Profiles Section */}
        {profiles.length > 0 ? (
        <div className="">
          <h2 className="text-2xl font-bold text-white mb-4 px-4 sm:px-0">Speaker Profiles</h2>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/4">
              <Card className="bg-purple/40 border-white/10 rounded-xl">
                <CardContent className="space-y-2 p-1">
                  {profiles.map((profile) => (
                    <div
                      key={profile._id}
                      className={`p-3 rounded-lg cursor-pointer space-y-2 transition-colors ${activeProfile === profile._id ? 'bg-black/50 rounded-xl' : 'hover:bg-white/5'}`}
                      onClick={() => setActiveProfile(profile._id)}
                    >
                      <h3 className="text-white font-medium text-sm md:text-base">{profile.title}</h3>
                      <p className="text-xs md:text-sm text-gray-400 truncate">{profile.shortBio}</p>
                      <p className="text-[0.7rem] flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" /> Updated {format(new Date(profile.updatedAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Active Profile Content */}
            <div className="w-full lg:flex-1 px-0 sm:px-0">
              <Card className="bg-black/40 border-white/10 rounded-xl">
                <CardHeader className="flex flex-row justify-between items-start">
                    <CardTitle className="text-white text-lg md:text-xl">
                        {getActiveProfile().title}
                    </CardTitle>
                    {getActiveProfile().isPublic && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-outile border border-purple-500 text-purple-500">
                        Public
                        </span>
                    )}
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-white mb-2">Short Biography</h3>
                    <p className="text-gray-300 text-sm md:text-base">{getActiveProfile().shortBio}</p>
                  </div>
                  
                  {getActiveProfile().mediumBio && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-white mb-2">About</h3>
                      <p className="text-gray-300 text-sm md:text-base">{getActiveProfile().mediumBio}</p>
                    </div>
                  )}
                  
                  {getActiveProfile().longBio && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-white mb-2">Full Biography</h3>
                      <p className="text-gray-300 text-sm md:text-base">{getActiveProfile().longBio}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    © Updated {format(new Date(getActiveProfile().updatedAt), "MMMM d, yyyy")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-white mb-4">Speaker Profiles</h2>
            <p className="text-gray-400">No public profiles available</p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/15 my-4"></div>

        {folders.length > 0 ? (
        <div>
          {/* Folders Grid */}            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
                <Card 
                key={folder._id} 
                className={`bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer p-3 rounded-xl overflow-hidden ${selectedFolder === folder._id ? 'border-purple-500' : ''}`}
                onClick={() => setSelectedFolder(selectedFolder === folder._id ? null : folder._id)}
                >
                {folder.images.length > 0 ? (
                    <div className="relative h-40 w-full ">
                    <img
                        src={folder.images[0].url}
                        alt={folder.images[0].name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs text-white">
                        {folder.images.length} photos
                    </div>
                    </div>
                ): (
                    <div className="relative h-40 w-full bg-gray-800/50 flex items-center justify-center">
                        <div className="text-center p-4">
                        <ImageIcon className="w-10 h-10 mx-auto text-gray-500" />
                        <p className="text-sm text-gray-400 mt-2">No images in this folder</p>
                        </div>
                    </div>
                )}
                
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                    <Folder className="text-purple-400" />
                    <CardTitle className="text-white">{folder.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-300 mb-2">{folder.description || "Checkout the images in this folder"}</p>
                    <p className="text-xs text-gray-500">
                    Created {format(new Date(folder.createdAt), "MMMM d, yyyy")}
                    </p>
                </CardContent>
                </Card>
            ))}
          </div>

          {/* Selected Folder Images Grid h */}
          {selectedFolder && (
            <div className="mt-6">
                <h3 className="text-xl flex items-center gap-1 font-semibold text-gray-500 mb-4">
                {getSelectedFolder()?.name} <ChevronRight /> Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getSelectedFolder()?.images.map((image) => (
                    <div key={image._id} className="group">
                    <div className="overflow-hidden rounded-xl">
                        <img 
                        src={image.url} 
                        alt={image.name} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <p className="text-sm text-gray-300 truncate mt-2">
                        {format(new Date(image.uploadedAt), "MMM d, yyyy")}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
         ) : (
            <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-white mb-4">Speaker Profiles Images</h2>
            <p className="text-gray-400">No public folders available</p>
          </div>
          )}
      </div>
    </div>
  );
}
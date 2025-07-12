"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Globe, MapPin, Folder, Image as   ImageIcon, X, Phone, Instagram, Linkedin,  Clock12, FolderOpen, ChevronUp, User2Icon, MailIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ">
      <div className="space-y-6 mx-auto max-w-[1100px] py-10 p-4 ">
        <div className="flex flex-col md:flex-row gap-6 bg-black/50 p-6 rounded-xl "> 
          <div className="flex justify-center md:justify-start">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-2 border-purple-500/30">
              <AvatarImage src={userData.image || "/profile-picture.jpg"} className="object-cover" />
              <AvatarFallback className="bg-purple-900/50 text-white text-2xl font-medium">
                {userData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* The top Profile Section */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-row justify-between items-center md:flex-row md:items-center md:justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {userData.name}
              </h1>
              
              <div className="flex items-center justify-center md:justify-end gap-3">
                <a href="#" className="p-2 bg-purple-700/80 hover:bg-purple-600 rounded-full transition-colors">
                  <X className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-purple-700/80 hover:bg-purple-600 rounded-full transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-purple-700/80 hover:bg-purple-600 rounded-full transition-colors">
                  <Phone className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-purple-700/80 hover:bg-purple-600 rounded-full transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="md:flex md:items-center gap-6  text-sm space-y-2">
              <div className="flex items-center text-gray-400 gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-purple-400" />
                <span>{userData.location || "Location not specified"}</span>
              </div>
              
              <div className="flex items-center text-gray-400 gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0 text-purple-400" />
                <span>
                  Joined {userData.createdAt ? format(new Date(userData.createdAt), "MMMM d, yyyy") : "Date not available"}
                </span>
              </div>

              <div className="flex items-center text-gray-400 gap-2">
                <Globe className="h-4 w-4 flex-shrink-0 text-purple-400" />
                {userData.website ? (
                  <a href={userData.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                    {userData.website}
                  </a>
                ) : (
                  <span>No website</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              
              <div className="flex items-center text-gray-400 gap-2">
                <MailIcon className="h-4 w-4 flex-shrink-0 text-purple-400" />
                {userData.email ? (
                  <a href={`mailto:${userData.email}`} className="hover:text-purple-300 transition-colors">
                    {userData.email}
                  </a>
                ) : (
                  <span>No email provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 my-4"></div>

        {/* Speaker Profiles Section */}
        {profiles.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 px-4 sm:px-0 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Speaker Profiles
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Speakrr Profile List */}
              <div className="w-full lg:w-1/3 xl:w-1/4">
                <Card className="bg-gradient-to-b from-purple-900/30 to-blue-900/20 border border-white/10 rounded-xl backdrop-blur-sm">
                  <CardContent className="space-y-3 p-3">
                    {profiles.map((profile) => (
                      <motion.div
                        key={profile._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-xl cursor-pointer space-y-2 transition-all duration-300 ${
                          activeProfile === profile._id 
                            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 shadow-lg shadow-purple-500/10 border border-purple-500/30' 
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                        onClick={() => setActiveProfile(profile._id)}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-white font-semibold text-base truncate">{profile.title}</h3>
                          {profile.isPublic && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{profile.shortBio}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock12 className="h-3 w-3 text-purple-400" />
                          <span>Updated {format(new Date(profile.updatedAt), "MMM d, yyyy")}</span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1">
                <motion.div
                  key={activeProfile}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card className="bg-gradient-to-br from-gray-900/70 via-purple-900/30 to-blue-900/20 border border-white/5 rounded-xl backdrop-blur-md h-full shadow-lg shadow-purple-500/10">
                    <CardHeader className="border-b border-white/5 pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-xl md:text-2xl font-bold">
                          {getActiveProfile().title}
                        </CardTitle>
                        {getActiveProfile().isPublic && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            Public
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 py-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Short Biography</h3>
                          <p className="text-gray-200 text-[0.9rem] leading-relaxed">{getActiveProfile().shortBio}</p>
                        </div>
                        
                        {getActiveProfile().mediumBio && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">About</h3>
                            <p className="text-gray-200 text-[0.9rem] leading-relaxed">{getActiveProfile().mediumBio}</p>
                          </div>
                        )}
                        
                        {getActiveProfile().longBio && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Full Biography</h3>
                            <p className="text-gray-200 text-[0.9rem] leading-relaxed">{getActiveProfile().longBio}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 text-xs text-gray-400 flex justify-between items-center">
                        <span>Last updated {format(new Date(getActiveProfile().updatedAt), "MMMM d, yyyy")}</span>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span>Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                <User2Icon className="w-10 h-10 text-gray-500" />
              </div>
            <h2 className="text-2xl font-bold text-white">No Speaker Profiles</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              This speaker hasn&apos;t created any public profiles yet. Check back later!
            </p>
          </div>
        )}

        <div className="border-t border-white/15 my-4"></div>

        {folders.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Image Galleries</h2>
            
            {/* Folders  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {folders.map((folder) => (
                <motion.div
                  key={folder._id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`bg-gray-900/50 border border-gray-700 p-4 rounded-xl overflow-hidden hover:border-purple-500 transition-colors ${
                      selectedFolder === folder._id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedFolder(selectedFolder === folder._id ? null : folder._id)}
                  >
                    {/* Image Preview */}
                    <div className="relative aspect-video">
                      {folder.images.length > 0 ? (
                        <>
                          <img
                            src={folder.images[0].url}
                            alt={folder.images[0].name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-white font-medium text-lg">{folder.name}</h3>
                                <p className="text-gray-300 text-sm">{folder.description}</p>
                              </div>
                              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                {folder.images.length} photos
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50">
                          <ImageIcon className="w-10 h-10 text-gray-500" />
                          <p className="text-gray-400 mt-2 text-sm">No images</p>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span>Created {format(new Date(folder.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/*  */}
            {selectedFolder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Folder className="text-purple-400" />
                    {getSelectedFolder()?.name}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      {getSelectedFolder()?.images.length} photos
                    </span>
                  </h3>
                  <button 
                    onClick={() => setSelectedFolder(null)}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <ChevronUp className="h-4 w-4" /> Collapse
                  </button>
                </div>

                <p className="text-gray-300 mb-6 max-w-2xl">{getSelectedFolder()?.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getSelectedFolder()?.images.map((image) => (
                    <motion.div
                      key={image._id}
                      whileHover={{ scale: 1.02 }}
                      className="relative group rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div>
                          <p className="text-white text-sm font-medium truncate">{image.name}</p>
                          <p className="text-gray-300 text-xs">
                            {format(new Date(image.uploadedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">No Image Galleries</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                This speaker hasn&apos;t created any public image galleries yet.
              </p>
            </div>
        )}
      </div>
    </div>
  );
}
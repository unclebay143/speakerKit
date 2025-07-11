// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { format } from "date-fns";
// import { Calendar, Globe, MapPin, Folder, Image as Clock } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useState } from "react";

// export default function ProfilePreview() {
//   const { data: session } = useSession();
//   const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
//   const [activeProfile, setActiveProfile] = useState<string>("1");

//   // Dummy data to match the screenshot
//   const profiles = [
//     {
//       id: "1",
//       title: "Senior Software Engineer & Tech Speaker",
//       shortBio: "Participating in both building methods and applications and sharing knowledge with the developers community.",
//       updatedAt: "2024-03-15T00:00:00.000Z",
//       isPublic: true,
//       createdAt: "2024-03-06"
//     },
//     {
//       id: "2",
//       title: "AI & Machine Learning Enthusiast",
//       shortBio: "Exploring the intersection of AI and web development to build intelligent applications.",
//       mediumBio: "Currently diving deep into machine learning and AI integration in web applications. I love experimenting with new technologies and finding practical applications for emerging AI tools.",
//       longBio: "As technology evolves, I've become increasingly fascinated by the potential of AI and machine learning in web development. We cannot focus on integrating AI capabilities into traditional web applications, exploring areas like natural language processing, computer vision, and automated testing. I enjoy experimenting with tools like PowerPoints, OpenAI's APIs, and various ML frameworks to create intelligent user experiences.",
//       updatedAt: "2024-07-11T00:00:00.000Z",
//       isPublic: true,
//       createdAt: "2024-03-15"
//     }
//   ];

//   // Dummy folders data
//   const folders = [
//     {
//       id: "1",
//       name: "Conference Speaking",
//       description: "Professional standard and sporting photos",
//       date: "February 1, 2024",
//       images: [
//         { id: "1", url: "/headshot1.jpg", name: "Tech Conference 2023" },
//         { id: "2", url: "/headshot2.jpg", name: "Keynote Speaker" }
//       ]
//     },
//     {
//       id: "2",
//       name: "Professional Headshots",
//       description: "High-quality musical pianists",
//       date: "January 15, 2024",
//       images: [
//         { id: "3", url: "/event1.jpg", name: "Workshop Session" },
//         { id: "4", url: "/event2.jpg", name: "Panel Discussion" }
//       ]
//     },
//     {
//       id: "3",
//       name: "Event Photos",
//       description: "Common theme videos with events",
//       date: "January 15, 2024",
//       images: [
//         { id: "5", url: "/event3.jpg", name: "Meetup Session" },
//         { id: "6", url: "/event4.jpg", name: "Networking Event" }
//       ]
//     }
//   ];

//   const handleFolderClick = (folderId: string) => {
//     setSelectedFolder(selectedFolder === folderId ? null : folderId);
//   };

//   const getActiveProfile = () => {
//     return profiles.find(profile => profile.id === activeProfile) || profiles[0];
//   };

//   const getSelectedFolder = () => {
//     return folders.find(folder => folder.id === selectedFolder);
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950">
//       <div className="space-y-6 mx-auto max-w-screen-xl py-10">
//         <div className="flex items-start gap-6 bg-black/40 p-6 py-10 rounded-xl">
//           <Avatar className="h-32 w-32 border-2 border-white/30">
//             <AvatarImage src="/profile-picture.jpg" />
//             <AvatarFallback>JS</AvatarFallback>
//           </Avatar>
          
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-white mb-2">John Wale</h1>
//             <div className="text-gray-300 flex items-center space-x-7 space-y-1">
//               <p className="flex text-gray-400 gap-2"> <span><MapPin/></span>San Francisco, CA</p>
//               <p className="flex text-gray-400 gap-2 "><span><Calendar/></span>Joined January 15, 2024</p>
//               <p className="flex text-gray-400 gap-2 "><span><Globe/></span>Website</p>
//             </div>

//             <div className="flex items-center mt-4 space-x-4">
//               <div>
//                 <p className="text-sm text-gray-400">Nigeria</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-white/15 my-4"></div>

//         {/* Speaker Profiles Section */}
//         <div className="">
//             <h2 className="text-2xl font-bold text-white mb-4 px-4 sm:px-0">Speaker Profiles</h2>

//             <div className="flex flex-col lg:flex-row gap-6">
//                 <div className="w-full lg:w-1/4">
//                 <Card className="bg-purple/40 border-white/10 rounded-xl">
//                     <CardContent className="space-y-2 p-1">
//                     {profiles.map((profile) => (
//                         <div
//                         key={profile.id}
//                         className={`p-3 rounded-lg cursor-pointer space-y-2 transition-colors ${activeProfile === profile.id ? 'bg-black/50 rounded-xl' : 'hover:bg-white/5'}`}
//                         onClick={() => setActiveProfile(profile.id)}
//                         >
//                         <h3 className="text-white font-medium text-sm md:text-base">{profile.title}</h3>
//                         <p className="text-xs md:text-sm text-gray-400 truncate">{profile.shortBio}</p>
//                         <p className="text-[0.7rem] flex items-center gap-1 text-gray-500">
//                             <Clock className="h-3 w-3" /> Updated {profile.createdAt}
//                         </p>
//                         </div>
//                     ))}
//                     </CardContent>
//                 </Card>
//                 </div>

//                 {/* Active Profile Content */}
//                 <div className="w-full lg:flex-1 px-0 sm:px-0">
//                 <Card className="bg-black/40 border-white/10 rounded-xl">
//                     <CardHeader>
//                     <CardTitle className="text-white text-lg md:text-xl">
//                         {getActiveProfile().title} {getActiveProfile().isPublic && (
//                         <span className="text-sm font-normal text-green-400">Public</span>
//                         )}
//                     </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4 md:space-y-6">
//                     <div>
//                         <h3 className="text-xs sm:text-sm font-medium text-white mb-2">Short Biography</h3>
//                         <p className="text-gray-300 text-sm md:text-base">{getActiveProfile().shortBio}</p>
//                     </div>
                    
//                     {getActiveProfile().mediumBio && (
//                         <div>
//                         <h3 className="text-xs sm:text-sm font-medium text-white mb-2">About</h3>
//                         <p className="text-gray-300 text-sm md:text-base">{getActiveProfile().mediumBio}</p>
//                         </div>
//                     )}
                    
//                     {getActiveProfile().longBio && (
//                         <div>
//                         <h3 className="text-xs sm:text-sm font-medium text-white mb-2">Full Biography</h3>
//                         <p className="text-gray-300 text-sm md:text-base">{getActiveProfile().longBio}</p>
//                         </div>
//                     )}
                    
//                     <div className="text-xs text-gray-400">
//                         © Updated {format(new Date(getActiveProfile().updatedAt), "MMMM d, yyyy")}
//                     </div>
//                     </CardContent>
//                 </Card>
//                 </div>
//             </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-white/15 my-4"></div>

//         {/* Image Galleries Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-4">Image Galleries</h2>
          
//           {/* Folders Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {folders.map((folder) => (
//               <Card 
//                 key={folder.id} 
//                 className={`bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer ${selectedFolder === folder.id ? 'border-purple-500' : ''}`}
//                 onClick={() => handleFolderClick(folder.id)}
//               >
//                 <CardHeader className="pb-2">
//                   <div className="flex items-center gap-3">
//                     <Folder className="text-purple-400" />
//                     <CardTitle className="text-white">{folder.name}</CardTitle>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-gray-300 mb-2">{folder.description}</p>
//                   <p className="text-xs text-gray-500">{folder.date}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Selected Folder Images Grid */}
//           {selectedFolder && (
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold text-white mb-4">
//                 {getSelectedFolder()?.name} - Images
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {getSelectedFolder()?.images.map((image) => (
//                   <Card key={image.id} className="bg-black/40 border-white/10">
//                     <CardContent className="p-4">
//                       <img 
//                         src={image.url} 
//                         alt={image.name} 
//                         className="w-full h-48 object-cover rounded-lg mb-2"
//                       />
//                       <p className="text-sm text-gray-300 truncate">{image.name}</p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
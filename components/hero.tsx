"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";
import { FloatingPaper } from "./floating-paper";
import { RoboAnimation } from "./robo-animation";

export default function Hero() {
  const [currentSharing, setCurrentSharing] = useState(0);
  const sharingOptions = [
    "with organizers",
    "with hosts",
    "on websites",
    "on social media",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSharing((prev) => (prev + 1) % sharingOptions.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const speakers = [
    {
      id: 1,
      name: "Speaker 1",
      image:
        "https://pbs.twimg.com/profile_images/1499696473100935170/GC5ad4uO_400x400.jpg",
      profile: "/john-doe",
    },
    {
      id: 2,
      name: "Speaker 2",
      image:
        "https://res.cloudinary.com/dpkl4o58w/image/upload/v1752427367/profile-images/user-unclebigbay%40gmail.com-1752427356012.png",
      profile: "/jane-smith",
    },
    {
      id: 3,
      name: "Speaker 3",
      image:
        "https://res.cloudinary.com/dpkl4o58w/image/upload/v1752427367/profile-images/user-unclebigbay%40gmail.com-1752427356012.png",
      profile: "/mike-johnson",
    },
    {
      id: 4,
      name: "Speaker 4",
      image:
        "https://res.cloudinary.com/dpkl4o58w/image/upload/v1752427367/profile-images/user-unclebigbay%40gmail.com-1752427356012.png",
      profile: "/sarah-wilson",
    },
    {
      id: 5,
      name: "Speaker 5",
      image:
        "https://res.cloudinary.com/dpkl4o58w/image/upload/v1752427367/profile-images/user-unclebigbay%40gmail.com-1752427356012.png",
      profile: "/david-brown",
    },
  ];

  return (
    <div className='relative min-h-[calc(100vh-76px)] flex items-center'>
      {/* Floating papers background */}
      <div className='absolute inset-0 overflow-hidden'>
        <FloatingPaper count={6} />
      </div>

      <div className='container mx-auto px-6 relative z-10'>
        <div className='max-w-4xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              Your{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                Speaker Profile
              </span>{" "}
              Deserves Better Than{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600'>
                Google Docs
              </span>
            </h1> */}

            {/* <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              Stop using{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600'>
                Google Docs
              </span>{" "}
              to share your{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                speaker profile
              </span>
            </h1> */}
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              Your{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600'>
                All-in-One
              </span>{" "}
              for Your{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                Speaker Brand
              </span>
            </h1>
            {/* <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              One{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600'>
                Home
              </span>{" "}
              for Your{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                Speaker Brand
              </span>
            </h1> */}

            {/* <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              Stop using{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600'>
                Google Docs
              </span>{" "}
              to share your{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                speaker profile
              </span>
            </h1> */}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='text-gray-400 text-xl mb-6 max-w-2xl mx-auto'
          >
            Create a stunning, shareable speaker profile with multiple bio
            versions, headshots, and event-ready links.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-400 mb-8'
          >
            {/* <div className='flex -space-x-2'>
              {speakers.map((speaker) => (
                <Link
                  key={speaker.id}
                  href={speaker.profile}
                  className='hover:scale-110 transition-transform duration-200'
                >
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className='w-8 h-8 rounded-full border-2 border-white'
                  />
                </Link>
              ))}
            </div> */}
            {/* <Users className='h-5 w-5' /> */}
            <span className='text-sm'>
              Join{" "}
              <span className='text-purple-400 font-semibold'>
                {/* 2,800+ speakers */}
                speakers
              </span>{" "}
              who&apos;ve made the switch.
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-4'
          >
            <div className='flex flex-col items-center gap-2'>
              <Link
                href='/signup'
                className='bg-purple-600 hover:bg-purple-700 text-white px-8'
              >
                <div className='flex py-3 gap-2 items-center'>
                  <FileText className='h-5 w-5' />
                  Create Your Profile
                </div>
              </Link>

              <div className='text-gray-400 text-sm opacity-70'>
                ...and share{" "}
                <span className='text-purple-400 font-semibold'>
                  <AnimatePresence mode='wait'>
                    <motion.span
                      key={currentSharing}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className='inline-block w-28 text-left'
                    >
                      {sharingOptions[currentSharing]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </div>

            {/* <Button
              size="lg"
              variant="outline"
              className="text-white border-purple-500 hover:bg-purple-500/20 bg-transparent"
            >
              <Sparkles className="h-5 w-5" />
              Browse Speakers
            </Button> */}
          </motion.div>
        </div>
      </div>

      {/* Animated robot */}
      <div className='absolute bottom-0 right-0 w-96 h-96'>
        <RoboAnimation />
      </div>
    </div>
  );
}

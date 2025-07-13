"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [featuresActive, setFeaturesActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const featuresSection = document.getElementById("features");
    if (!featuresSection) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setFeaturesActive(entry.isIntersecting);
      },
      { root: null, threshold: 0.3 }
    );
    observer.observe(featuresSection);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className='flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10 fixed top-0 left-0 w-full z-20'
    >
      <div className='md:container md:px-6 mx-auto flex items-center justify-between w-full'>
        <div className='flex items-center space-x-8'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-white font-medium text-xl'>SpeakerKit</span>
          </Link>
          <div className='hidden md:flex items-center space-x-4'>
            <Link
              href='/#features'
              className={`transition-colors ${
                featuresActive
                  ? "text-purple-400 font-semibold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              Features
            </Link>
            <Link
              href='/pricing'
              className={`transition-colors ${
                pathname === "/pricing"
                  ? "text-purple-400 font-semibold"
                  : "text-white hover:text-purple-400"
              }`}
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className='hidden md:flex items-center space-x-4'>
          <Button
            className='bg-purple-600 hover:bg-purple-700 text-white'
            asChild
          >
            <Link href='/signup'>Create Profile</Link>
          </Button>
          <Link
            className={`transition-colors ${
              pathname === "/login"
                ? "text-purple-400 font-semibold"
                : "text-white hover:text-purple-400"
            }`}
            href='/login'
          >
            Sign In
          </Link>
        </div>
        <Button variant='ghost' size='icon' className='md:hidden text-white'>
          <Menu className='w-6 h-6' />
        </Button>
      </div>
    </motion.nav>
  );
}

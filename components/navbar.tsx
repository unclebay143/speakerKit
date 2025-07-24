"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [featuresActive, setFeaturesActive] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className='flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10 fixed top-0 left-0 w-full z-20'
      >
        <div className='md:container md:px-6 mx-auto flex items-center justify-between w-full'>
          <div className='flex items-center space-x-8'>
            <Link href='/' className='flex items-center space-x-2'>
              {/* <svg
                width='30'
                height='24'
                viewBox='0 0 50 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z'
                  fill='#8B5CF6'
                ></path>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z'
                  fill='white'
                ></path>
                <path
                  d='M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z'
                  fill='#A78BFA'
                  fillOpacity='0.3'
                ></path>
              </svg> */}
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
            {user && !isLoading ? (
              <>
                <Button
                  className='bg-purple-600 hover:bg-purple-700 text-white'
                  asChild
                >
                  <Link href='/overview'>Dashboard</Link>
                </Button>
                <Button
                  variant='outline'
                  className='border-purple-600 text-white hover:bg-purple-600/20'
                  asChild
                >
                  <Link href={`/@${user.slug}`}>View Profile</Link>
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          <button
            className='md:hidden text-white hover:text-purple-400 bg-purple-600/20 rounded-md p-2'
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className='w-6 h-6' />
          </button>
        </div>
      </motion.nav>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-30 bg-black/70 flex justify-end'>
          <div className='w-64 bg-white dark:bg-black h-full p-6 flex flex-col space-y-6 relative'>
            <button
              className='absolute top-4 right-4 text-gray-700 dark:text-white'
              onClick={() => setMobileMenuOpen(false)}
              aria-label='Close menu'
            >
              <X className='w-6 h-6' />
            </button>
            <nav className='flex flex-col space-y-4 mt-10'>
              <Link
                href='/#features'
                onClick={() => setMobileMenuOpen(false)}
                className={`transition-colors ${
                  featuresActive
                    ? "text-purple-400 font-semibold"
                    : "text-gray-900 dark:text-white hover:text-purple-400"
                }`}
              >
                Features
              </Link>
              <Link
                href='/pricing'
                onClick={() => setMobileMenuOpen(false)}
                className={`transition-colors ${
                  pathname === "/pricing"
                    ? "text-purple-400 font-semibold"
                    : "text-gray-900 dark:text-white hover:text-purple-400"
                }`}
              >
                Pricing
              </Link>
              {user && !isLoading ? (
                <>
                  <Link
                    href='/overview'
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-purple-600 font-semibold'
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/@${user.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-purple-600 font-semibold'
                  >
                    View Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href='/signup'
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-purple-600 font-semibold'
                  >
                    Create Profile
                  </Link>
                  <Link
                    href='/login'
                    onClick={() => setMobileMenuOpen(false)}
                    className='text-purple-600 font-semibold'
                  >
                    Sign In
                  </Link>
                </>
              )}
            </nav>
          </div>
          {/* Click outside to close */}
          <div className='flex-1' onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

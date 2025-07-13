"use client";

import { motion } from "framer-motion";
import {
  Image,
  Layers,
  MessageSquareText,
  RefreshCw,
  Share,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { SparklesCore } from "./sparkles";

export default function FeaturesSection() {
  const features = [
    {
      icon: UserCircle,
      title: "Create a Polished Speaker Profile",
      description:
        "Craft a clean, professional profile with your bio, topics, links, and photos, all in one link. No more sending scattered documents or clunky Google Drive folders.",
    },
    {
      icon: MessageSquareText,
      title: "Tell Your Story, Your Way",
      description:
        "Don't let event organizers guess who you are. Highlight your journey, achievements, and speaking topics with clarity and confidence.",
    },
    {
      icon: Share,
      title: "Make It Easy for Organizers",
      description:
        "Give event teams exactly what they need: headshots, bios, and talk details, in one place. Save them time and increase your chances of getting booked.",
    },
    {
      icon: RefreshCw,
      title: "Create Once, Use Forever",
      description:
        "Your profile link is always ready. Reuse it for conferences, podcasts, workshops, and networking—just update details when needed.",
    },
    {
      icon: Layers,
      title: "Multiple Speaker Profiles for Different Roles",
      description:
        "Switch between versions of your profile depending on the event. Create one for technical talks, another for design panels, or a custom one for corporate keynotes.",
    },
    {
      icon: Image,
      title: "Upload Multiple Photos",
      description:
        "Add professional headshots and casual portraits. Give organizers options based on event tone or branding requirements.",
    },
  ];
  return (
    <section
      id='features'
      className='py-20 bg-black/[0.96] bg-grid-white/[0.02] relative overflow-hidden min-h-screen lg:h-screen'
    >
      {/* Lively animated background */}
      <div className='absolute inset-0 w-full h-full z-0'>
        <SparklesCore
          id='tsparticles-features'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className='w-full h-full'
          particleColor='#A78BFA'
        />
      </div>
      <div className='container mx-auto px-6 relative z-10'>
        <div className='text-center mb-16'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6'
          >
            Designed for Speakers Who Want to Be Taken Seriously
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-gray-400 text-xl max-w-3xl mx-auto'
          >
            Everything you need to look professional, stay organized, and make a
            lasting impression.
          </motion.p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='bg-black border border-white/[0.05] rounded-lg p-6 hover:bg-black/80 transition-colors duration-300'
              >
                <div className='text-purple-400 mb-4'>
                  <IconComponent className='w-8 h-8' />
                </div>
                <h3 className='text-xl font-semibold text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-400 leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='text-center mt-16'
        >
          <Link
            href='/signup'
            className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-block transition-colors duration-300'
          >
            Start Your Free Profile Today
          </Link>
          <p className='text-gray-400 mt-4 text-lg'>
            Impress organizers. Tell your story. Book more gigs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

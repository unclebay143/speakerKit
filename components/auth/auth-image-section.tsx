"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Mic, Share2, Globe, Star, TrendingUp, Award, Zap } from "lucide-react"

interface AuthImageSectionProps {
  type: "signup" | "login"
}

const features = [
  {
    icon: Users,
    title: "100+ Speakers",
    description: "Join our growing community",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Mic,
    title: "Multiple Profiles",
    description: "Create profiles for different contexts",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your profile with one click",
    color: "from-pink-400 to-pink-600",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with desired companies worldwide",
    color: "from-green-400 to-green-600",
  },
]

const testimonials = [
  {
    name: "Sarah Adedapo",
    role: "Tech Conference Speaker",
    content: "SpeakerKit made managing my speaker profiles so much easier!",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Workshop Facilitator",
    content: "I love how I can create different bios for different events.",
    avatar: "MJ",
  },
  {
    name: "Mary Olu S.",
    role: "Software Developer",
    content: "The sharing features are incredible. I love it!",
    avatar: "MO",
  },
]

const stats = [
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
  { icon: Award, value: "5+", label: "Awards" },
  { icon: Zap, value: "2x", label: "Faster Setup" },
]

export default function AuthImageSection({ type }: AuthImageSectionProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => {
      clearInterval(featureInterval)
      clearInterval(testimonialInterval)
    }
  }, [])

  return (
    <div className="relative h-full bg-black/20 backdrop-blur-xl overflow-hidden border-r border-white/10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5" />

        {/* Floating Glass Orb */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full backdrop-blur-sm"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            {type === "signup" ? "Join SpeakerKit" : "Welcome Back"}
          </h2>
          <p className="text-gray-300">
            {type === "signup"
              ? "Create your professional speaker profile in minutes"
              : "Continue building your speaker presence"}
          </p>
        </motion.div>

        {/*  Feature Cards */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${features[currentFeature].color} shadow-lg`}>
                  {(() => {
                    const IconComponent = features[currentFeature].icon
                    return <IconComponent className="w-6 h-6 text-white" />
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{features[currentFeature].title}</h3>
                  <p className="text-sm text-gray-300">{features[currentFeature].description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature ? "bg-purple-400 scale-125" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/8 backdrop-blur-md rounded-xl p-4 text-center border border-white/15 shadow-lg hover:bg-white/12 transition-all duration-300"
              >
                <IconComponent className="w-7 h-7 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Testimonial */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm mb-3 italic">&ldquo;{testimonials[currentTestimonial].content}&rdquo;</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonials[currentTestimonial].name}</p>
                    <p className="text-purple-300 text-xs font-medium">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

         
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-pink-400 scale-125" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <motion.div
          className="absolute bottom-8 left-8 right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="text-center">
            <motion.p
              className="text-gray-300 text-sm font-medium"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              ✨ Trusted worldwide
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

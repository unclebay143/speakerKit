"use client"

import {  Menu, UserRoundPen } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react" 
import { Button } from "./ui/button"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <UserRoundPen className="w-8 h-8 text-purple-500" />
        <span className="text-white font-medium text-xl">SpeakerKit</span>
      </Link>

     

      <div className="hidden md:flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" className="text-white hover:text-purple-400">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Create Profile</Button>
        </Link>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

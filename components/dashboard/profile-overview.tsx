"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Copy, Share, Users, FileText, ImageIcon } from "lucide-react"
import { CreateProfileModal } from "../modals/profile-modal"

const initialProfiles = [
  {
    id: 1,
    title: "General Speaker Profile",
    type: "General",
    bioLength: "Long",
    lastUpdated: "2 days ago",
    isPublic: true,
    description: "Full-Stack Developer with 4+ years of experience in web development and technical education.",
  },
  {
    id: 2,
    title: "Frontend Developer Profile",
    type: "Frontend",
    bioLength: "Medium",
    lastUpdated: "1 week ago",
    isPublic: false,
    description: "Specialized profile focusing on React, Next.js, and modern frontend technologies.",
  },
  {
    id: 3,
    title: "Conference Speaker Profile",
    type: "Conference",
    bioLength: "Short",
    lastUpdated: "3 days ago",
    isPublic: true,
    description: "Concise profile for conference introductions and event materials.",
  },
]

const stats = [
  { label: "Total Profiles", value: "3", icon: FileText, color: "text-blue-400" },
  { label: "Images Uploaded", value: "12", icon: ImageIcon, color: "text-purple-400" },
  { label: "Public Profiles", value: "2", icon: Users, color: "text-orange-400" },
]

export function ProfilesOverview() {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleProfileCreated = (newProfile: any) => {
    setProfiles((prev) => [newProfile, ...prev])
    // Update stats
    stats[0].value = String(profiles.length + 1)
    if (newProfile.isPublic) {
      const publicCount = profiles.filter((p) => p.isPublic).length + 1
      stats[2].value = String(publicCount)
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-screen-lg">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Mary! 👋</h2>
        <p className="text-gray-300">You have {profiles.length} active profiles.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-black/40 border-white/10">
              <CardContent className="p-6 md:w-56 xl:w-80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Profiles List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Profiles</h3>
          <Button onClick={() => setShowCreateModal(true)} className="bg-purple-600 hover:bg-purple-700">
            Create New Profile
          </Button>
        </div>

        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="bg-black/40 border-white/10 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {profile.title}
                      <Badge variant={profile.isPublic ? "default" : "secondary"} className="text-xs">
                        {profile.isPublic ? "Public" : "Private"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">{profile.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>Type: {profile.type}</span>
                    <span>Length: {profile.bioLength}</span>
                  </div>
                  <span>Updated {profile.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {profiles.length === 0 && (
          <Card className="bg-black/40 border-white/10 border-dashed">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No profiles yet</h3>
              <p className="text-gray-400 mb-6">Create your first speaker profile to get started</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-purple-600 hover:bg-purple-700">
                Create Your First Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Profile Modal */}
      
    </div>
  )
}

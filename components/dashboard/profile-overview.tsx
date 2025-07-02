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
    lastUpdated: "2 days ago",
    isPublic: true,
    shortBio: "Full-Stack Developer with 4+ years of experience. whhgfvbhfcv hgbjcsdhjccfg  hbgzcbfsbcdgdfbcsfcj hbfjcnbf",
    mediumBio:
      "Full-Stack Developer with 4+ years of experience in web development, specializing in React and Node.js.",
    longBio:
      "Ayodele Samuel Adebayo (UncleBigBay) is a Full-Stack Developer, Technical Writer, and Educator with over four years of experience building scalable web platforms and developing educational content for developers worldwide.",
  },
  {
    id: 2,
    title: "Frontend Developer Profile",
    lastUpdated: "1 week ago",
    isPublic: false,
    shortBio: "Frontend Developer specializing in React.",
    mediumBio: "Frontend Developer with expertise in React, Next.js, and modern JavaScript frameworks.",
    longBio: "",
  },
  {
    id: 3,
    title: "Conference Speaker Profile",
    lastUpdated: "3 days ago",
    isPublic: true,
    shortBio: "Tech conference speaker and developer advocate.",
    mediumBio: "",
    longBio: "",
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

  const getBioBadges = (profile: any) => {
    const badges = []

    if (profile.shortBio && profile.shortBio.trim()) {
      badges.push(
        <Badge key="short" variant="outline" className="text-xs border-green-500/30 text-green-300 bg-green-500/10">
          Short
        </Badge>,
      )
    }

    if (profile.mediumBio && profile.mediumBio.trim()) {
      badges.push(
        <Badge key="medium" variant="outline" className="text-xs border-blue-500/30 text-blue-300 bg-blue-500/10">
          Medium
        </Badge>,
      )
    }

    if (profile.longBio && profile.longBio.trim()) {
      badges.push(
        <Badge key="long" variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
          Long
        </Badge>,
      )
    }

    return badges
  }

  return (
    <div className="space-y-6 mx-auto max-w-screen-lg">
      {/* First Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Mary! 👋</h2>
        <p className="text-gray-300">You have {profiles.length} active profiles.</p>
      </div>

      {/* Statistics section of profile and images */}
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

      {/* Profiles */}
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
                        {profile.isPublic ? "Visible" : "Hidden"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {profile.shortBio.length > 100
                        ? `${profile.shortBio.substring(0, 100)}...`
                        : profile.shortBio}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
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
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">{getBioBadges(profile)}</div>
                    </div>
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

      {/* Modal */}
      <CreateProfileModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onProfileCreated={handleProfileCreated}
      />
    </div>
  )
}

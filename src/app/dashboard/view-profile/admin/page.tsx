"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Mail, Phone, Calendar, Globe, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic";

interface LanguageProficiency {
  language: string
  proficiency: string
}

interface AdminProfile {
  adminProfileId: string
  fullName: string
  username: string
  gender: string
  dob: string
  email: string
  phone: string
  location: string
  profilePicture: string
  profilePictureMimeType?: string
  languageProficiency: string
}

const defaultAdminProfile: AdminProfile = {
  adminProfileId: "",
  fullName: "",
  username: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  location: "",
  profilePicture: "",
  profilePictureMimeType: "",
  languageProficiency: "",
}

export default function AdminProfile() {
  const [formData, setFormData] = useState<AdminProfile>(defaultAdminProfile)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const userId = useSearchParams().get("userId");
    
    if (!userId) {
      console.error("User ID is required");
      return null;
    }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/profile/admin/view-profile/${userId}`, {
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await res.json()
        setFormData(data)
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }
    fetchProfile()
  }, [backendUrl])

  const languageProficiency: LanguageProficiency[] = JSON.parse(formData?.languageProficiency || "[]")

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 sm:ml-0 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center sm:text-left p-6 rounded-xl border border-transparent ml-20 mr-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 md:gap-75">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-2">Admin Profile</h1>
            <p className="text-gray-600">View your professional profile</p>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-4">
            <Badge className="bg-black text-white px-3 py-1 hover:bg-gray-800">
              <Users className="w-4 h-4 mr-1" />
              Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mr-20 ml-20">
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-lg">
                    <AvatarImage
                      src={
                        formData.profilePicture && formData.profilePictureMimeType
                          ? `data:${formData.profilePictureMimeType};base64,${formData.profilePicture}`
                          : "/placeholder.svg?height=128&width=128"
                      }
                      alt={formData.fullName}
                    />
                    <AvatarFallback className="text-2xl bg-gray-100 text-gray-600">
                      {formData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{formData.fullName}</h2>
                  <p className="text-gray-600">@{formData.username}</p>
                  <p className="text-sm text-gray-500 mt-1">{formData.adminProfileId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                <User className="w-5 h-5 text-gray-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pl-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{formData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {formData.dob ? new Date(formData.dob).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                <Globe className="w-5 h-5 text-gray-600" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-6">
              <div className="space-y-3">
                {languageProficiency.length === 0 && <p className="text-gray-500 text-sm">No languages added.</p>}
                {languageProficiency.map((lp, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{lp.language}</span>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      {lp.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
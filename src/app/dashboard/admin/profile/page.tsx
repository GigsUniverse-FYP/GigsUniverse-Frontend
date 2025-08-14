"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Edit3, Save, X, MapPin, Mail, Phone, Calendar, Globe, Plus, Minus, Upload, Users } from "lucide-react"
import { toast } from "react-toastify"
import { languages, locationData, proficiencyLevels } from "../../freelancer/lib/onboarding-data"

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
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<AdminProfile>(defaultAdminProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/profile/admin/my-profile`, {
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

  const handleInputChange = <K extends keyof AdminProfile>(field: K, value: AdminProfile[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const languageProficiency: LanguageProficiency[] = JSON.parse(formData?.languageProficiency || "[]")

  const addLanguage = () => {
    const updated = [...languageProficiency, { language: "", proficiency: "" }]
    handleInputChange("languageProficiency", JSON.stringify(updated))
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...languageProficiency]
    updated[index] = { ...updated[index], [field]: value }
    handleInputChange("languageProficiency", JSON.stringify(updated))
  }

  const removeLanguage = (index: number) => {
    const updated = [...languageProficiency]
    updated.splice(index, 1)
    handleInputChange("languageProficiency", JSON.stringify(updated))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files).filter((file) => file.size <= 10 * 1024 * 1024)
    const file = files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result?.toString()
        if (!result) return
        const base64Data = result.split(",")[1] || result
        setFormData((prev) => ({
          ...prev,
          profilePicture: base64Data,
          profilePictureMimeType: file.type,
        }))
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ""
  }

  function base64ImageToFile(base64: string, filename: string, mimeType: string): File {
    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64
    const byteString = atob(base64Data)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new File([ab], filename, { type: mimeType })
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      const nonFileData: Record<string, any> = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePicture" || key === "email") {
          return
        }
        nonFileData[key] = value
      })
      if (typeof nonFileData.languageProficiency === "string") {
        try {
          nonFileData.languageProficiency = JSON.parse(nonFileData.languageProficiency)
        } catch (e) {
          console.error("Invalid JSON in languageProficiency", e)
        }
      }
      formDataToSend.append("data", JSON.stringify(nonFileData))
      if (formData.profilePicture && formData.profilePictureMimeType) {
        try {
          const extension = formData.profilePictureMimeType.split("/")[1]
          const filename = `profile-picture.${extension}`
          const file = base64ImageToFile(formData.profilePicture, filename, formData.profilePictureMimeType)
          formDataToSend.append("profilePicture", file)
        } catch (e) {
          console.error("Error converting profile picture to file", e)
        }
      }
      const response = await fetch(`${backendUrl}/api/profile/admin/save`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Backend error:", response.status, errorText)
        throw new Error("Failed to save profile")
      }
      toast.success("Profile saved successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast.error("Failed to save profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/profile/admin/my-profile`, {
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await res.json()
        setFormData(data)
        setIsEditing(false)
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }
    fetchProfile()
  }

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.username &&
      formData.gender &&
      formData.dob &&
      formData.phone &&
      formData.location &&
      languageProficiency.length > 0 &&
      languageProficiency.every((lp) => lp.language && lp.proficiency)
    )
  }

  return (
    <div className="w-full sm:max-w-8xl space-y-6 mb-5 -ml-10 sm:ml-0 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center sm:text-left p-6 rounded-xl border border-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 md:gap-75">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-2">Admin Profile</h1>
            <p className="text-gray-600">Manage your professional profile</p>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-4">
            <Badge className="bg-black text-white px-3 py-1 hover:bg-gray-800">
              <Users className="w-4 h-4 mr-1" />
              Admin
            </Badge>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!isFormValid() || isSubmitting}
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
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
                {isEditing && (
                  <div className="mb-4">
                    <Label htmlFor="profilePicture" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Upload New Photo</span>
                      </div>
                    </Label>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-left block text-gray-700 mb-1">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-left block text-gray-700 mb-1">
                        Username *
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{formData.fullName}</h2>
                    <p className="text-gray-600">@{formData.username}</p>
                    <p className="text-sm text-gray-500 mt-1">{formData.adminProfileId}</p>
                  </div>
                )}
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
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 mb-1">
                      Email
                    </Label>
                    <Input id="email" value={formData.email} disabled className="bg-gray-50 border-gray-300" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 mb-1">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-gray-700 mb-1">
                      Location *
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("location", value)} value={formData.location}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationData.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-gray-700 mb-1">
                      Gender *
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)} value={formData.gender}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dob" className="text-gray-700 mb-1">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              ) : (
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
              )}
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
              {isEditing ? (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={addLanguage}
                    className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 w-full justify-center bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Add Language
                  </Button>
                  {languageProficiency.map((lp, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg relative"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLanguage(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 h-auto w-auto"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div>
                        <Label className="text-gray-700 mb-1">Language</Label>
                        <Select onValueChange={(value) => updateLanguage(index, "language", value)} value={lp.language}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-700 mb-1">Proficiency</Label>
                        <Select
                          onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                          value={lp.proficiency}
                        >
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select proficiency" />
                          </SelectTrigger>
                          <SelectContent>
                            {proficiencyLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

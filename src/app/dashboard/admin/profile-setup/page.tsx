"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Plus, Minus, XCircle, ArrowRight } from "lucide-react"
import { languages, locationData, proficiencyLevels } from "@/lib/data"

export default function AdminProfileSetup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)


  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/profile/admin/session`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch user info")
        const data = await res.json()
        setFormData((prev) => ({
          ...prev,
          adminProfileId: data.userId,
          email: data.email,
        }))
      } catch (err) {
        console.error(err)
      }
    }

    fetchUserInfo()
  }, [])

  const [formData, setFormData] = useState({
    adminProfileId: "",
    fullName: "",
    username: "",
    gender: "",
    dob: "",
    email: "", 
    phone: "",
    location: "",
    profilePicture: null as File | null,
    profilePictureMimeType: "",
    languageProficiency: [] as { language: string; proficiency: string }[]
  })


  useEffect(() => {
    const savedFormData = localStorage.getItem("profile-form-data")
    if (savedFormData) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(savedFormData) }))
    }
  }, [])

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    localStorage.setItem("profile-form-data", JSON.stringify(newFormData))
  }

  const handleFileChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>,
    multiple?: boolean
  ) => {
    if (!e.target.files) return;

    const incomingFiles = Array.from(e.target.files);

    // File size validation (10MB max)
    const validFiles = incomingFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== incomingFiles.length) {
      alert("Some files exceeded the 10MB limit and were not added.");
    }

    // File count limits
    const maxLimits: { [key: string]: number } = {
      profilePicture: 1
    };

    const maxFiles = maxLimits[field] ?? 1;

    const singleFile = validFiles[0] || null;
      setFormData(prev => ({
        ...prev,
        profilePicture: singleFile,
        profilePictureMimeType: singleFile?.type
      }));
    e.target.value = '';
  };

  const addLanguage = () => {
    handleInputChange("languageProficiency", [...formData.languageProficiency, { language: "", proficiency: "" }])
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...formData.languageProficiency]
    updated[index] = { ...updated[index], [field]: value }
    handleInputChange("languageProficiency", updated)
  }

  const removeLanguage = (index: number) => {
    const updated = [...formData.languageProficiency]
    updated.splice(index, 1)
    handleInputChange("languageProficiency", updated)
  }

  

  const isFormValid = () => {

    return (
      formData.fullName &&
      formData.username &&
      formData.gender &&
      formData.dob &&
      formData.phone &&
      formData.location &&
      formData.profilePicture &&
      formData.languageProficiency.length > 0 &&
      formData.languageProficiency.every((lp) => lp.language && lp.proficiency)
    )
  }

  const saveToDatabase = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      const nonFileData: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === 'profilePicture' || key === 'email' 
        ) {
          return;
        }
        nonFileData[key] = value;
      });

      
      formDataToSend.append(
  "data",
  new Blob([JSON.stringify(nonFileData)], { type: "application/json" })
); // No Blob

        // Append files
        if (formData.profilePicture instanceof File) {
          formDataToSend.append('profilePicture', formData.profilePicture); 
        }

        // Send to backend
        const response = await fetch(`${backendUrl}/api/profile/admin/save`, {
          method: 'POST',
          body: formDataToSend,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend error:", response.status, errorText);
          console.log("FormData contents: ", formDataToSend);
        }

        if (response.ok) {
          localStorage.removeItem("profile-form-data");
          router.push("/dashboard/admin");
        }

      } catch (error) {
        console.error("Failed to save profile:", error);
        alert("Failed to save profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GigsUniverse</h1>
          <p className="text-gray-600">Complete your profile setup to start finding amazing opportunities</p>
        </div>

        <Card className="mb-8 w-full">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Professional Profile</h2>
                <p className="text-gray-600">Setup your professional profile to attract clients</p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="employerProfileId" className="mb-2 block">
                    Employer Profile ID
                  </Label>
                  <Input
                    id="employerProfileId"
                    value={formData.adminProfileId}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName" className="mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="username" className="mb-2 block">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="JohnDoe123"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="mb-2 block">
                    Gender *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("gender", value)} value={formData.gender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dob" className="mb-2 block">
                    Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block">
                    Email
                  </Label>
                  <Input id="email" value={formData.email} disabled className="bg-gray-100" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="mb-2 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="mb-2 block">
                    Location *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("location", value)} value={formData.location}>
                    <SelectTrigger id="location">
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
              </div>

              <div>
                <Label htmlFor="profilePicture" className="mb-2 block">
                  Profile Picture * (Max 10MB)
                </Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("profilePicture", e)}
                  className="file:text-blue-600 file:font-medium"
                  required
                />
                {formData.profilePicture instanceof File && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              formData.profilePicture instanceof File
                                ? URL.createObjectURL(formData.profilePicture)
                                : "/public/images/placeholder.jpg"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formData.profilePicture.name}</p>
                          <p className="text-xs text-gray-500">
                            {(formData.profilePicture.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleInputChange("profilePicture", null)}>
                        <XCircle className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Proficiency */}
              <div className="space-y-4 border p-6 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Language Proficiency * (Min 1)</h3>
                  <Button variant="outline" onClick={addLanguage} className="flex items-center gap-2 bg-transparent">
                    <Plus className="w-4 h-4" /> Add Language
                  </Button>
                </div>
                {formData.languageProficiency.map((lp, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div>
                      <Label className="mb-2 block">Language</Label>
                      <Select onValueChange={(value) => updateLanguage(index, "language", value)} value={lp.language}>
                        <SelectTrigger>
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
                      <Label className="mb-2 block">Proficiency</Label>
                      <Select
                        onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                        value={lp.proficiency}
                      >
                        <SelectTrigger>
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
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-end items-center mt-6">
          <Button
            onClick={saveToDatabase}
            disabled={!isFormValid() || isSubmitting}
            className="flex items-center gap-2 bg-black hover:bg-gray-800"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
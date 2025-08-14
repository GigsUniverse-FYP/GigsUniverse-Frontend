"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Briefcase, Plus, Minus, XCircle, ArrowRight } from "lucide-react"
import StepIndicator from "../step-indicator"
import {
  locationData,
  languages,
  proficiencyLevels,
  educationLevels
} from "../../lib/onboarding-data-emp"
import { cn } from "@/lib/utils"
import useOnboardingRedirect from "../../lib/useOnboardingRules"

export default function Step2ProfileCreation() {
  const router = useRouter()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useOnboardingRedirect()

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/profile/employer/session`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch user info")
        const data = await res.json()
        setFormData((prev) => ({
          ...prev,
          employerProfileId: data.userId,
          email: data.email,
        }))
      } catch (err) {
        console.error(err)
      }
    }

    fetchUserInfo()
  }, [])

  const [formData, setFormData] = useState({
    employerProfileId: "",
    fullName: "",
    username: "",
    gender: "",
    dob: "",
    email: "", 
    phone: "",
    location: "",
    profilePicture: null as File | null,
    profilePictureMimeType: "",
    selfDescription: "",
    languageProficiency: [] as { language: string; proficiency: string }[],
    openToHire: false,
    jobExperiences: [] as { jobTitle: string; fromDate: string; toDate: string; company: string; description: string; currentJob: boolean }[],
    educations: [] as { institute: string; title: string; courseName: string; fromDate: string; toDate: string; currentStudying: boolean }[],
    certificationFiles: [] as File[],
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
      certificationFiles: 3,
      profilePicture: 1,
      resumeFile: 1
    };

    const maxFiles = maxLimits[field] ?? 1;

    if (multiple) {
      let currentFiles: File[] = [];
      if (field === "certificationFiles") {
        currentFiles = formData[field as "certificationFiles"];
      }
      const availableSlots = maxFiles - currentFiles.length;

      if (availableSlots <= 0) return;

      const filesToAdd = validFiles.slice(0, availableSlots);

      setFormData(prev => ({
        ...prev,
        [field]: [...currentFiles, ...filesToAdd]
      }));
    } 
    else if (field === "profilePicture") {
      const singleFile = validFiles[0] || null;
      setFormData(prev => ({
        ...prev,
        profilePicture: singleFile,
        profilePictureMimeType: singleFile?.type
      }));
    }     
    else {
      const singleFile = validFiles[0] || null;
      setFormData(prev => ({
        ...prev,
        [field]: singleFile
      }));
    }

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

  const addJobExperience = () => {
    handleInputChange("jobExperiences", [
      ...formData.jobExperiences,
      { jobTitle: "", fromDate: "",  toDate: "", company:"", description: "", currentJob: false },
    ])
  }

  const updateJobExperience = (index: number, field: string, value: string) => {
    const updated = [...formData.jobExperiences]
    updated[index] = { ...updated[index], [field]: value }
    handleInputChange("jobExperiences", updated)
  }

  const handleCurrentJobToggle = (index: number, checked: boolean) => {
    const updatedExperiences = formData.jobExperiences.map((exp, i) => ({
      ...exp,
      currentJob: i === index ? checked : false, // Only one can be current
      toDate: i === index && checked ? "" : exp.toDate, // Clear toDate if current
    }))
    handleInputChange("jobExperiences", updatedExperiences)
  }

  const removeJobExperience = (index: number) => {
    const updated = [...formData.jobExperiences]
    updated.splice(index, 1)
    handleInputChange("jobExperiences", updated)
  }

  const addEducation = () => {
    handleInputChange("educations", [
      ...formData.educations,
      { institute: "", title: "", courseName: "", fromDate: "", toDate: "", currentStudying: false },
    ])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...formData.educations]
    updated[index] = { ...updated[index], [field]: value }
    handleInputChange("educations", updated)
  }

  const handleCurrentEducationToggle = (index: number, checked: boolean) => {
    const updatedEducations = formData.educations.map((edu, i) =>
      i === index
        ? {
            ...edu,
            currentStudying: checked,                // Use the actual checked value
            toDate: checked ? "" : edu.toDate, // Clear toDate if currently studying
          }
        : edu
    )
    handleInputChange("educations", updatedEducations)
  }

  const removeEducation = (index: number) => {
    const updated = [...formData.educations]
    updated.splice(index, 1)
    handleInputChange("educations", updated)
  }

  const removeFile = (field: string, index: number) => {
    const currentFiles = [...(formData[field as keyof typeof formData] as File[])]
    currentFiles.splice(index, 1)
    handleInputChange(field, currentFiles)
  }

  const isFormValid = () => {
    const wordCount = formData.selfDescription.split(/\s+/).filter(Boolean).length

    return (
      formData.fullName &&
      formData.username &&
      formData.gender &&
      formData.dob &&
      formData.phone &&
      formData.location &&
      formData.profilePicture &&
      wordCount >= 50 &&
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
          key === 'profilePicture' ||
          key === 'resumeFile' ||
          key === 'certificationFiles' ||
          key === 'email' 
        ) {
          return;
        }
        nonFileData[key] = value;
      });

      

      formDataToSend.append('data', JSON.stringify(nonFileData)); // No Blob

        // Append files
        if (formData.profilePicture instanceof File) {
          formDataToSend.append('profilePicture', formData.profilePicture); 
        }

        formData.certificationFiles.forEach(file => {
          formDataToSend.append('certificationFiles', file);
        });

        // Send to backend
        const response = await fetch(`${backendUrl}/api/profile/employer/save`, {
          method: 'POST',
          body: formDataToSend,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend error:", response.status, errorText);
        }

        if (response.ok) {
          localStorage.removeItem("profile-form-data");
          router.push("/dashboard/employer/onboarding/step-3");
        }

      } catch (error) {
        console.error("Failed to save profile:", error);
        alert("Failed to save profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }

  const wordCount = formData.selfDescription.split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GigsUniverse</h1>
          <p className="text-gray-600">Complete your profile setup to start finding amazing opportunities</p>
        </div>

        <StepIndicator currentStep={2} completedSteps={completedSteps} />

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
                    value={formData.employerProfileId}
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
                                : "/placeholder.svg"
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

              <div>
                <Label htmlFor="selfDescription" className="mb-2 block">
                  Self-Description * (Min 50 words)
                </Label>
                <Textarea
                  id="selfDescription"
                  value={formData.selfDescription}
                  onChange={(e) => handleInputChange("selfDescription", e.target.value)}
                  placeholder="Tell clients about your experience, expertise, and what makes you unique..."
                  rows={6}
                  required
                />
                <p className={cn("text-sm mt-2", wordCount < 50 ? "text-red-500" : "text-gray-500")}>
                  {wordCount} words (min 50)
                </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2 pt-3">
                  <Switch
                    id="openToHire"
                    checked={formData.openToHire}
                    onCheckedChange={(checked) => handleInputChange("openToHire", checked)}
                  />
                  <Label htmlFor="openToHire">I'm Currently Open to Hire</Label>
                </div>
              </div>

              {/* Job Experience */}
              <div className="space-y-4 border p-6 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Job Experience (Optional)</h3>
                  <Button
                    variant="outline"
                    onClick={addJobExperience}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" /> Add Experience
                  </Button>
                </div>
                {formData.jobExperiences.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeJobExperience(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="mb-2 block">Job Title</Label>
                        <Input
                          value={exp.jobTitle}
                          onChange={(e) => updateJobExperience(index, "jobTitle", e.target.value)}
                          placeholder="Senior Developer"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="mb-2 block">Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateJobExperience(index, "company", e.target.value)}
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">From Date</Label>
                        <Input
                          type="date"
                          value={exp.fromDate}
                          onChange={(e) => updateJobExperience(index, "fromDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">To Date</Label>
                        <Input
                          type="date"
                          value={exp.toDate}
                          onChange={(e) => updateJobExperience(index, "toDate", e.target.value)}
                          disabled={exp.currentJob}
                          placeholder={exp.currentJob ? "Present" : ""}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`current-job-${index}`}
                        checked={exp.currentJob}
                        onCheckedChange={(checked) => handleCurrentJobToggle(index, checked)}
                      />
                      <Label htmlFor={`current-job-${index}`}>Current Job</Label>
                    </div>
                    <div>
                      <Label className="mb-2 block">Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateJobExperience(index, "description", e.target.value)}
                        placeholder="Describe your role and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4 border p-6 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Education (Optional)</h3>
                  <Button variant="outline" onClick={addEducation} className="flex items-center gap-2 bg-transparent">
                    <Plus className="w-4 h-4" /> Add Education
                  </Button>
                </div>
                {formData.educations.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Institute</Label>
                        <Input
                          value={edu.institute}
                          onChange={(e) => updateEducation(index, "institute", e.target.value)}
                          placeholder="University of Example"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Degree/Title</Label>
                        <Select onValueChange={(value) => updateEducation(index, "title", value)} value={edu.title}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent>
                            {educationLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Course Name</Label>
                      <Input
                        value={edu.courseName}
                        onChange={(e) => updateEducation(index, "courseName", e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">From Date</Label>
                        <Input
                          type="date"
                          value={edu.fromDate}
                          onChange={(e) => updateEducation(index, "fromDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">To Date</Label>
                        <Input
                          type="date"
                          value={edu.toDate}
                          onChange={(e) => updateEducation(index, "toDate", e.target.value)}
                          disabled={edu.currentStudying}
                          placeholder={edu.currentStudying ? "Present" : ""}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`currently-studying-${index}`}
                        checked={edu.currentStudying}
                        onCheckedChange={(checked) => handleCurrentEducationToggle(index, checked)}
                      />
                      <Label htmlFor={`currently-studying-${index}`}>Currently Studying</Label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="space-y-4 border p-6 rounded-lg bg-white">
                <h3 className="text-lg font-semibold text-gray-900">
                  Certifications (Optional, Max 3 files, 10MB each)
                </h3>
                <Input
                  type="file"
                  multiple
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => handleFileChange("certificationFiles", e, true)}
                  className="file:text-blue-600 file:font-medium"
                  disabled={formData.certificationFiles.length >= 3}
                />
                <div className="space-y-3">
                  {formData.certificationFiles.map((file, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {file?.type?.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Certification preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile("certificationFiles", index)}>
                          <XCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
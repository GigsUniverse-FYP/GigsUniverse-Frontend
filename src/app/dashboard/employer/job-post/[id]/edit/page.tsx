"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, ArrowLeft, XCircle } from "lucide-react"
import Link from "next/link"
import {
  locationData,
  skillTags,
  languages,
  jobField,
  jobCategories,
  educationLevels,
  experienceLevels,
  jobTitles,
} from "@/lib/data"
import { toast } from "react-toastify"

interface ProfileCompanyDTO {
  companyId: number
  companyName: string
  role: string
}

interface JobData {
  id: number
  jobTitle: string
  jobDescription: string
  jobScope: string
  isPremiumJob: boolean
  skillTags: string[]
  jobField: string
  jobCategory: string[]
  yearsOfJobExperience: string
  jobExperience: string[]
  requiredLanguages: string[]
  hoursContributionPerWeek: number
  highestEducationLevel: string[]
  jobStatus: string
  preferredPayrate: string
  duration: string
  jobLocationHiringRequired: boolean
  jobLocation: string[]
  languageProficiency: string[]
  createdAt: string
  updatedAt: string
  jobExpirationDate: string
  displayCompany: boolean
  companyName: string
  employerName: string
  applicationsCount: number
}

const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    customJobTitle: false,
    jobDescription: "",
    jobScope: "",
    isPremiumJob: false,
    skillTags: [] as string[],
    jobField: "",
    jobCategory: [] as string[],
    yearsOfExperienceFrom: "",
    yearsOfExperienceTo: "",
    jobExperience: [] as string[],
    hoursContributionPerWeek: "",
    highestEducationLevel: [] as string[],
    jobStatus: "Active",
    payRateFrom: "",
    payRateTo: "",
    durationValue: "",
    durationUnit: "",
    jobLocationHiring: "",
    jobLocation: [] as string[],
    companyName: "",
    languageProficiency: [] as string[],
  })

 const { id } = React.use(params);

  const jobId = parseInt(id, 10);

  const [companyNameOptions, setCompanyNameOptions] = useState<string[]>(["Personal Profile"])

  const locationHiringOptions = ["Global", "Location-Specific Hiring"]

  const [userHasPremium, setUserHasPremium] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/employer/subscription/premium-status`, {
          method: "GET",
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch premium status")
        }

        const data: boolean = await res.json()
        setUserHasPremium(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPremiumStatus()
  }, [])

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/company/my-profile-company`, {
          credentials: "include",
        })

        if (res.ok) {
          if (res.status === 204) return

          const text = await res.text()
          if (!text) return 

          const data: ProfileCompanyDTO = JSON.parse(text)

          if (data?.companyName) {
            setCompanyNameOptions((prev) => {
              return prev.includes(data.companyName) ? prev : [...prev, data.companyName]
            })
          }
        } else {
          console.error("Failed to fetch company:", res.statusText)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchCompany()
  }, [backendUrl])

  const convertToArray = (value: string | string[]): string[] => {
    if (!value) return []  
    return typeof value === "string"
      ? value.split(",").map((v) => v.trim()) 
      : value
  }

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`${backendUrl}/api/job-posts/fetch-job/${jobId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return console.error("Job not found");
      const data: JobData = await res.json();

      const formattedJob: JobData = {
        ...data,
        skillTags: convertToArray(data.skillTags),
        jobCategory: convertToArray(data.jobCategory),
        jobExperience: convertToArray(data.jobExperience),
        highestEducationLevel: convertToArray(data.highestEducationLevel),
        jobLocation: convertToArray(data.jobLocation),
        languageProficiency: convertToArray(data.languageProficiency),
        displayCompany: data.companyName !== "Personal Profile",
      };

      setFormData({
        jobTitle: formattedJob.jobTitle || "",
        customJobTitle: false, // set true if backend supports custom titles
        jobDescription: formattedJob.jobDescription || "",
        jobScope: formattedJob.jobScope || "",
        isPremiumJob: formattedJob.isPremiumJob || false,
        skillTags: formattedJob.skillTags || [],
        jobField: formattedJob.jobField || "",
        jobCategory: formattedJob.jobCategory || [],
        yearsOfExperienceFrom: formattedJob.yearsOfJobExperience?.split("-")[0] || "",
        yearsOfExperienceTo: formattedJob.yearsOfJobExperience?.split("-")[1] || "",
        jobExperience: formattedJob.jobExperience || [],
        hoursContributionPerWeek: formattedJob.hoursContributionPerWeek?.toString() || "",
        highestEducationLevel: formattedJob.highestEducationLevel || [],
        jobStatus: formattedJob.jobStatus || "Active",
        payRateFrom: formattedJob.preferredPayrate?.split("-")[0] || "",
        payRateTo: formattedJob.preferredPayrate?.split("-")[1] || "",
        durationValue: formattedJob.duration?.split(" ")[0] || "",
        durationUnit: formattedJob.duration?.split(" ")[1] || "",
        jobLocationHiring: formattedJob.jobLocationHiringRequired
          ? "Location-Specific Hiring"
          : "Global",
        jobLocation: formattedJob.jobLocation || [],
        companyName: formattedJob.companyName || "",
        languageProficiency: formattedJob.languageProficiency || [],
      });

      console.log("Formatted Job:", formattedJob);
    };
    fetchJob();
  }, [jobId]);

  const isFormValid = () => {
    return (
      formData.jobTitle.trim() !== "" &&
      countWords(formData.jobDescription) >= 50 &&
      countWords(formData.jobScope) >= 50 &&
      formData.skillTags.length > 0 &&
      formData.jobCategory.length > 0 &&
      formData.jobField.length > 0 &&
      formData.jobExperience.length > 0 &&
      formData.jobLocationHiring !== "" &&
      formData.companyName !== "" &&
      formData.languageProficiency.length > 0 &&
      (formData.jobLocationHiring === "Global" || formData.jobLocation.length > 0)
    )
  }

  const addLanguageProficiency = (lang: string) => {
    if (formData.languageProficiency.length < 5 && !formData.languageProficiency.includes(lang)) {
      handleInputChange("languageProficiency", [...formData.languageProficiency, lang])
    }
  }

  const removeLanguageProficiency = (lang: string) => {
    handleInputChange(
      "languageProficiency",
      formData.languageProficiency.filter((l) => l !== lang),
    )
  }

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
  }

  const addSkillTags = (skill: string) => {
    if (formData.skillTags.length < 10 && !formData.skillTags.includes(skill)) {
      handleInputChange("skillTags", [...formData.skillTags, skill])
    }
  }

  const removeSkillTag = (skill: string) => {
    handleInputChange(
      "skillTags",
      formData.skillTags.filter((s) => s !== skill),
    )
  }

  const handleJobCategoryToggle = (category: string) => {
    if (formData.jobCategory.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        jobCategory: prev.jobCategory.filter((c) => c !== category),
      }))
    } else if (formData.jobCategory.length < 3) {
      setFormData((prev) => ({
        ...prev,
        jobCategory: [...prev.jobCategory, category],
      }))
    }
  }

  const handleExperienceToggle = (exp: string) => {
    if (formData.jobExperience.includes(exp)) {
      setFormData((prev) => ({
        ...prev,
        jobExperience: prev.jobExperience.filter((e) => e !== exp),
      }))
    } else if (formData.jobExperience.length < 3) {
      setFormData((prev) => ({
        ...prev,
        jobExperience: [...prev.jobExperience, exp],
      }))
    }
  }

  const handleEducationToggle = (edu: string) => {
    if (formData.highestEducationLevel.includes(edu)) {
      setFormData((prev) => ({
        ...prev,
        highestEducationLevel: prev.highestEducationLevel.filter((e) => e !== edu),
      }))
    } else if (formData.highestEducationLevel.length < 3) {
      setFormData((prev) => ({
        ...prev,
        highestEducationLevel: [...prev.highestEducationLevel, edu],
      }))
    }
  }

  const addLocationOption = (location: string) => {
    if (!formData.jobLocation.includes(location)) {
      handleInputChange("jobLocation", [...formData.jobLocation, location])
    }
  }

  const removeLocationTag = (location: string) => {
    handleInputChange(
      "jobLocation",
      formData.jobLocation.filter((l) => l !== location),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${backendUrl}/api/job-posts/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to update job post")
      }

      toast.success("Job Post Updated!")
    } catch (err) {
      console.error("Error updating job post:", err)
      toast.error("Error updating job post.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Job Post</h1>
        <Link href={`/dashboard/employer/job-post/${id}`}>
          <Button variant="outline" size="sm" className="flex items-center bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobTitle" className="mb-4">
                Job Title *
              </Label>

              {formData.customJobTitle ? (
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g. Freelance React Developer"
                  required
                />
              ) : (
                <Select
                  value={formData.jobTitle}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, jobTitle: value }))}
                >
                  <SelectTrigger id="jobTitle" className="w-full">
                    <SelectValue placeholder="Select a job title" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="customJobTitle"
                  checked={formData.customJobTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customJobTitle: e.target.checked }))}
                  className="mt-2"
                />
                <Label htmlFor="customJobTitle" className="mt-2">
                  Enter custom job title
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="jobDescription" className="mt-2 mb-4">
                Job Description *
              </Label>
              <Textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, jobDescription: e.target.value }))}
                placeholder="Describe the job role and responsibilities in a detailed manner..."
                rows={4}
                required
              />
              <p className="text-xs mt-1 text-red-500 ml-1">{countWords(formData.jobDescription)} / 50 * (Min 50 words)</p>
            </div>

            <div>
              <Label htmlFor="jobScope" className="mb-4">
                Job Scope *
              </Label>
              <Textarea
                id="jobScope"
                value={formData.jobScope}
                onChange={(e) => setFormData((prev) => ({ ...prev, jobScope: e.target.value }))}
                placeholder="Define the scope and deliverables of the job in detail..."
                rows={3}
              />
              <p className="text-xs mt-1 text-red-500 ml-1">{countWords(formData.jobScope)} / 50 * (Min 50 words)</p>
            </div>

            <div>
              <Label htmlFor="companyName" className="mb-4">
                Company Name *
              </Label>
              <Select
                value={formData.companyName}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, companyName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company or personal profile" />
                </SelectTrigger>
                <SelectContent>
                  {companyNameOptions.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userHasPremium && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPremiumJob"
                  checked={formData.isPremiumJob}
                  className="mt-5"
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPremiumJob: checked as boolean }))}
                />
                <Label htmlFor="isPremiumJob" className="mt-5">
                  Premium Job (Only Premium User)
                </Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills and Category */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full">
              <Label className="mb-2 block">Skill Tags * (Max 10)</Label>
              <Select onValueChange={addSkillTags} disabled={formData.skillTags.length >= 10}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select skills" />
                </SelectTrigger>
                <SelectContent>
                  {skillTags
                    .filter((skill) => !formData.skillTags.includes(skill))
                    .map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.skillTags.length > 0 && (
                <div className="mt-3 w-full min-w-0">
                  <div className="flex flex-wrap gap-2">
                    {formData.skillTags.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1 px-3 py-1 max-w-full">
                        <span className="truncate">{skill}</span>
                        <button
                          type="button"
                          className="cursor-pointer hover:text-red-600 flex-shrink-0 ml-1"
                          onClick={() => removeSkillTag(skill)}
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="jobField" className="mb-4">
                Job Field *
              </Label>
              <Select
                value={formData.jobField}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, jobField: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {jobField.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label className="mb-2 block">Language Proficiency * (Max 5)</Label>
              <Select onValueChange={addLanguageProficiency} disabled={formData.languageProficiency.length >= 5}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select languages" />
                </SelectTrigger>
                <SelectContent>
                  {languages
                    .filter((lang) => !formData.languageProficiency.includes(lang))
                    .map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.languageProficiency.length > 0 && (
                <div className="mt-3 w-full min-w-0">
                  <div className="flex flex-wrap gap-2">
                    {formData.languageProficiency.map((lang) => (
                      <Badge key={lang} variant="secondary" className="flex items-center gap-1 px-3 py-1 max-w-full">
                        <span className="truncate">{lang}</span>
                        <button
                          type="button"
                          className="cursor-pointer hover:text-red-600 flex-shrink-0 ml-1"
                          onClick={() => removeLanguageProficiency(lang)}
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Type and Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Job Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-4">Job Categories (Max 3) *</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {jobCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={formData.jobCategory.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleJobCategoryToggle(category)}
                  >
                    {category}
                    {formData.jobCategory.includes(category) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearsFrom" className="mb-4">
                  Years of Experience From *
                </Label>
                <Input
                  id="yearsFrom"
                  type="number"
                  value={formData.yearsOfExperienceFrom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperienceFrom: e.target.value }))}
                  placeholder="1"
                  className="mb-4"
                />
              </div>
              <div>
                <Label htmlFor="yearsTo" className="mb-4">
                  Years of Experience To *
                </Label>
                <Input
                  id="yearsTo"
                  type="number"
                  value={formData.yearsOfExperienceTo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperienceTo: e.target.value }))}
                  placeholder="5"
                  className="mb-4"
                />
              </div>
            </div>

            <div>
              <Label className="mb-4">Experience Level (Max 3) *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {experienceLevels.map((level) => (
                  <Badge
                    key={level}
                    variant={formData.jobExperience.includes(level) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleExperienceToggle(level)}
                  >
                    {level}
                    {formData.jobExperience.includes(level) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="hoursContribution" className="mb-4">
                Hours Contribution Per Week *
              </Label>
              <Input
                id="hoursContribution"
                type="number"
                value={formData.hoursContributionPerWeek}
                onChange={(e) => setFormData((prev) => ({ ...prev, hoursContributionPerWeek: e.target.value }))}
                placeholder="40"
                className="mb-4"
              />
            </div>

            <div>
              <Label className="mb-4">Highest Education Level (Max 3) *</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {educationLevels.map((edu) => (
                  <Badge
                    key={edu}
                    variant={formData.highestEducationLevel.includes(edu) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleEducationToggle(edu)}
                  >
                    {edu}
                    {formData.highestEducationLevel.includes(edu) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment and Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payRateFrom" className="mb-4">
                  Pay Rate From ($/hour) *
                </Label>
                <Input
                  id="payRateFrom"
                  type="number"
                  value={formData.payRateFrom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, payRateFrom: e.target.value }))}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="payRateTo" className="mb-4">
                  Pay Rate To ($/hour) *
                </Label>
                <Input
                  id="payRateTo"
                  type="number"
                  value={formData.payRateTo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, payRateTo: e.target.value }))}
                  placeholder="35"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="durationValue" className="mb-4">
                  Duration *
                </Label>
                <Input
                  id="durationValue"
                  type="number"
                  value={formData.durationValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, durationValue: e.target.value }))}
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <Label htmlFor="durationUnit" className="mb-4">
                  Unit *
                </Label>
                <Select
                  value={formData.durationUnit}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, durationUnit: value }))}
                >
                  <SelectTrigger id="durationUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location and Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobLocationHiring" className="mb-4">
                Location Hiring Type *
              </Label>
              <Select
                value={formData.jobLocationHiring}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, jobLocationHiring: value, jobLocation: [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location hiring preference" />
                </SelectTrigger>
                <SelectContent>
                  {locationHiringOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.jobLocationHiring === "Location-Specific Hiring" && (
              <div>
                <Label className="mb-2 block">Select Countries/Locations *</Label>
                <Select onValueChange={addLocationOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select countries/locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationData
                      .filter((location) => !formData.jobLocation.includes(location))
                      .map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formData.jobLocation.length > 0 && (
                  <div className="mt-3 w-full min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {formData.jobLocation.map((location) => (
                        <Badge
                          key={location}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1 max-w-full"
                        >
                          <span className="truncate">{location}</span>
                          <button
                            type="button"
                            className="cursor-pointer hover:text-red-600 flex-shrink-0 ml-1"
                            onClick={() => removeLocationTag(location)}
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {formData.jobLocationHiring && formData.jobLocationHiring !== "Location-specific hiring required" && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <Badge variant="secondary">{formData.jobLocationHiring}</Badge>
              </div>
            )}

            <div>
              <Label htmlFor="jobStatus" className="mb-4">
                Job Status *
              </Label>
              <Select
                value={formData.jobStatus}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, jobStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" className="bg-black hover:bg-gray-800" disabled={!isFormValid()}>
            Update Job Post
          </Button>
          <Link href={`/dashboard/employer/job-post/${id}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

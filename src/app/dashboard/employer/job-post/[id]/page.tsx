"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Clock,
  Calendar,
  MapPin,
  Users,
  Crown,
  Building,
  User,
  Star,
  MessageSquare,
  X,
} from "lucide-react"
import Link from "next/link"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"

interface JobData {
  id: number
  employerId: string
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
}

interface Application {
  id: number
  freelancerId: string
  freelancerName: string
  freelancerAvatar: string
  // rating: number;
  // completedJobs: number;
  hourlyRate: number
  proposal: string
  appliedAt: string
  skills: string[]
  jobStatus: string
}

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [activeTab, setActiveTab] = useState("details")

  const { id } = React.use(params)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const jobId = Number.parseInt(id, 10)

  const [applications, setApplications] = useState<Application[]>([])

  const [jobData, setJobData] = useState<JobData>({
    id: 0,
    employerId: "",
    jobTitle: "",
    jobDescription: "",
    jobScope: "",
    isPremiumJob: false,
    skillTags: [],
    jobField: "",
    jobCategory: [],
    requiredLanguages: [],
    yearsOfJobExperience: "",
    jobExperience: [],
    hoursContributionPerWeek: 0,
    highestEducationLevel: [],
    jobStatus: "",
    preferredPayrate: "",
    duration: "",
    jobLocationHiringRequired: false,
    jobLocation: [],
    languageProficiency: [],
    createdAt: "",
    updatedAt: "",
    jobExpirationDate: "",
    displayCompany: false,
    companyName: "",
    employerName: "",
  })

  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const [rejectApplication, setRejectApplication] = useState<Application | null>(null)

  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/job-applications/job/${jobId}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch applications")
        const data = await res.json()
        setApplications(data)

        console.log(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchApplications()
  }, [jobId])

  const convertToArray = (value: string | string[]): string[] => {
    if (!value) return []
    return typeof value === "string" ? value.split(",").map((v) => v.trim()) : value
  }

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`${backendUrl}/api/job-posts/fetch-job/${jobId}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) return console.error("Job not found")
      const data: JobData = await res.json()

      const formattedJob: JobData = {
        ...data,
        skillTags: convertToArray(data.skillTags),
        jobCategory: convertToArray(data.jobCategory),
        jobExperience: convertToArray(data.jobExperience),
        highestEducationLevel: convertToArray(data.highestEducationLevel),
        jobLocation: convertToArray(data.jobLocation),
        languageProficiency: convertToArray(data.languageProficiency),
        displayCompany: data.companyName !== "Personal Profile",
      }

      setJobData(formattedJob)

      console.log(formattedJob)
    }
    fetchJob()
  }, [jobId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Inactive":
        return "bg-red-100 text-red-800 border border-red-200"
      case "Expired":
        return "bg-orange-100 text-orange-800 border border-orange-200"
      case "Full":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const handleReject = async (applicationId: string, rejectReason: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/job-applications/${applicationId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(rejectReason),
      })

      if (!res.ok) {
        throw new Error("Failed to reject application")
      }


      setApplications((prev) =>
        prev.map((a) => (a.id.toString() === applicationId ? { ...a, jobStatus: "rejected" } : a)),
      )

      toast.success("Application rejected successfully")

      setShowRejectDialog(false)
      setRejectReason("")
    } catch (err) {
      console.error(err)
    }
  }

  // Shortlist
  const handleShortlist = async (applicationId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/job-applications/${applicationId}/shortlist`, {
        method: "PUT",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to shortlist application")

      setApplications((prev) =>
        prev.map((a) => (a.id.toString() === applicationId ? { ...a, jobStatus: "shortlisted" } : a)),
      )
      toast.success("Application shortlisted successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to shortlist application")
    }
  }

  // Unshortlist (set back to pending)
  const handleUnshortlist = async (applicationId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/job-applications/${applicationId}/unshortlist`, {
        method: "PUT",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to unshortlist application")

      setApplications((prev) =>
        prev.map((a) => (a.id.toString() === applicationId ? { ...a, jobStatus: "pending" } : a)),
      )
      toast.success("Application unshortlisted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to unshortlist application")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side: Job info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance break-words">{jobData.jobTitle}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {jobData.isPremiumJob && (
                <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 shrink-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Badge className={`${getStatusColor(jobData.jobStatus)} shrink-0`}>{jobData.jobStatus}</Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1 shrink-0">
              {jobData.displayCompany ? (
                <>
                  <Building className="h-4 w-4" />
                  <span className="truncate">{jobData.companyName}</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span className="truncate">{jobData.employerName}</span>
                </>
              )}
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="shrink-0">
                Posted: &nbsp;
                {jobData.createdAt
                  ? new Date(jobData.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="shrink-0">
                Last Updated: &nbsp;
                {jobData.updatedAt
                  ? new Date(jobData.updatedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="shrink-0">
                Expires: &nbsp;
                {jobData.jobExpirationDate
                  ? new Date(jobData.jobExpirationDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Buttons grouped together */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <Link href={`/dashboard/employer/job-post`}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          {jobData.jobStatus === "Expired" ? (
            <Button className="bg-gray-400 cursor-not-allowed w-full sm:w-auto" disabled>
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          ) : (
            <Link href={`/dashboard/employer/job-post/${id}/edit`}>
              <Button className="bg-black hover:bg-gray-800 w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Hourly Rate</p>
                <p className="font-semibold text-sm sm:text-base truncate">${jobData.preferredPayrate}/hr</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Hours/Week</p>
                <p className="font-semibold text-sm sm:text-base">{jobData.hoursContributionPerWeek}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Applications</p>
                <p className="font-semibold text-sm sm:text-base">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-sm sm:text-base truncate">{jobData.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="text-xs sm:text-sm">
            Job Details
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-xs sm:text-sm">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{jobData.jobDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Job Scope</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{jobData.jobScope}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {jobData.skillTags.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Required Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {jobData.languageProficiency.map((language, index) => (
                      <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Job Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Field</p>
                    <p className="text-gray-900 text-sm sm:text-base">{jobData.jobField}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Job Type</p>
                    <div className="flex flex-wrap gap-1">
                      {jobData.jobCategory.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Experience</p>
                    <p className="text-gray-900 text-sm sm:text-base">{jobData.yearsOfJobExperience} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Experience Level</p>
                    <div className="flex flex-wrap gap-1">
                      {jobData.jobExperience.map((exp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Education</p>
                    <div className="flex flex-wrap gap-1">
                      {jobData.highestEducationLevel.map((edu, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {edu}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobData.jobLocationHiringRequired ? (
                    <div className="space-y-2">
                      {jobData.jobLocation.map((location, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                          <span className="text-sm break-words">{location}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <Badge variant="secondary">Global</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                        <AvatarImage src={application.freelancerAvatar || "/public/images/placeholder.jpg"} />
                        <AvatarFallback>
                          {application.freelancerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{application.freelancerName}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {/* <span>{application.rating}</span> */}
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <span>{/* {application.completedJobs} jobs completed */}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>${application.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">Applied: {application.appliedAt}</p>
                      <div className="flex flex-wrap gap-2">
                       {application.jobStatus === "rejected" ? (
                        <div className="inline-block bg-red-100 border border-red-400 text-red-700 text-sm px-3 py-1 rounded-lg">
                          Rejected Application
                        </div>
                        ) : application.jobStatus === "shortlisted" ? (
                          <>
                            {/* Contract */}
                            <Link
                              href={{
                                pathname: `/dashboard/employer/job-post/${jobId}/contract`,
                                query: {
                                  jobApplicationId: application.id,
                                  employerId: jobData.employerId,
                                  freelancerId: application.freelancerId,
                                  jobId: jobId,
                                },
                              }}
                            >
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                              >
                                📄 Contract
                              </Button>
                            </Link>
                            {/* Unshortlist */}
                            <Button
                              size="sm"
                              className="bg-gray-500 hover:bg-gray-600 text-white text-xs sm:text-sm"
                              onClick={() => handleUnshortlist(application.id.toString())}
                            >
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Unshortlist
                            </Button>
                          </>
                        ) : application.jobStatus === "contract" ? (
                             <div className="inline-block bg-green-100 border border-green-400 text-green-700 text-sm px-3 py-1 rounded-lg">
                               Contract Sent
                            </div>
                        ) : (
                          <>
                            {/* Reject */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm bg-transparent"
                              onClick={() => {
                                setShowRejectDialog(true)
                                setRejectApplication(application)
                              }}
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Reject
                            </Button>

                            {/* Shortlist */}
                            <Button
                              size="sm"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm"
                              onClick={() => handleShortlist(application.id.toString())}
                            >
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Shortlist
                            </Button>
                          </>
                        )}


                        {/* Message */}
                        <Link href={`/dashboard/employer/chat?userId=${application.freelancerId}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Message
                        </Button>
                        </Link>

                        {/* View Profile */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm bg-transparent"
                        >
                          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Proposal</h4>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                      {application.proposal}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {applications.length === 0 && (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Applications will appear here once freelancers start applying to your job.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Reject Application</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="rejectReason" className="text-sm font-semibold text-gray-900">
                Reject Reason
              </Label>
              <Textarea
                id="rejectReason"
                placeholder="Provide a reason for rejecting this application..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
                className="mt-2 min-h-[100px] text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">{rejectReason.length}/500 (Max 500 Characters)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectReason("")
                }}
                className="flex-1 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={() => rejectApplication?.id && handleReject(rejectApplication.id.toString(), rejectReason)}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

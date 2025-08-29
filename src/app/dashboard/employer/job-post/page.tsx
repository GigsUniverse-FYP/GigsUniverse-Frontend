"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Briefcase,
  Users,
  Edit,
  Search,
  Calendar,
  DollarSign,
  Clock,
  Plus,
  Filter,
  ExternalLink,
  Crown,
} from "lucide-react"
import Link from "next/link"

interface JobPost {
  job_post_id: number
  jobTitle: string
  jobDescription: string
  preferredPayrate: string
  jobStatus: string
  createdAt: string
  jobExpirationDate: string
  applicationsCount: number
  skillTags: string[]
  hoursContributionPerWeek: number
  duration: string
  isPremiumJob: boolean
}
export default function JobPostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobPosts, setJobPosts] = useState<JobPost[]>([])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [userHasPremium, setUserHasPremium] = useState(false)
  const [jobPostsThisMonth, setJobPostsThisMonth] = useState(0)
  const [resetDate, setResetDate] = useState<string>("")

  const maxQuota = userHasPremium ? 5 : 2
  const remaining = maxQuota - jobPostsThisMonth
  const canPost = remaining > 0

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPremium = await fetch(`${backendUrl}/api/employer/subscription/premium-status`, {
          method: "GET",
          credentials: "include",
        })
        if (!resPremium.ok) throw new Error("Failed to fetch premium status")
        const premiumData: boolean = await resPremium.json()
        setUserHasPremium(premiumData)

        const resCount = await fetch(`${backendUrl}/api/job-posts/employer/monthly-count`, {
          method: "GET",
          credentials: "include",
        })
        if (!resCount.ok) throw new Error("Failed to fetch job post count")

        const data = await resCount.json() 
        console.log("Monthly count RAW response:", data)

        const parsedCount =
          typeof data === "number"
            ? data
            : typeof data?.count === "number"
              ? data.count
              : typeof data?.jobCount === "number"
                ? data.jobCount
                : 0

        const parsedResetDate = typeof data === "string" ? data : (data?.resetDate ?? data?.nextReset ?? "")

        setJobPostsThisMonth(parsedCount)
        setResetDate(parsedResetDate)
        console.log("Monthly count parsed:", { parsedCount, parsedResetDate })
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [backendUrl])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/job-posts/fetch-jobs`, {
          method: "GET",
          credentials: "include",
        })

        if (!res.ok) {
          console.error("Error fetching employer jobs:", await res.text())
          throw new Error("Failed to fetch employer jobs")
        }

        const data: JobPost[] = await res.json()
        console.log("Raw data from backend:", data)

        const formattedJobs: JobPost[] = data.map((job: any) => ({
          job_post_id: job.jobPostId,
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          preferredPayrate: job.preferredPayrate,
          jobStatus: job.jobStatus,
          createdAt: job.createdAt,
          jobExpirationDate: job.jobExpirationDate,
          applicationsCount: job.applicationsCount,
          skillTags:
            typeof job.skillTags === "string"
              ? job.skillTags.split(",").map((tag: string) => tag.trim())
              : job.skillTags,
          hoursContributionPerWeek: job.hoursContributionPerWeek,
          duration: job.duration,
          isPremiumJob: job.isPremiumJob,
        }))

        setJobPosts(formattedJobs)

        console.log(formattedJobs)
      } catch (err) {
        console.error("Error loading jobs:", err)
      }
    }

    fetchJobs()
  }, [backendUrl])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Closed":
        return "bg-red-100 text-red-800 border border-red-200"
      case "Expired":
        return "bg-orange-100 text-orange-800 border border-orange-200"
      case "Full":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const filteredPosts = jobPosts.filter((post) => {
    const matchesSearch = post.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.jobStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mb-5">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Job Posts</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Total Jobs Posted</p>
                <p className="text-2xl font-bold text-black">{jobPosts.length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <Briefcase className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Active Jobs</p>
                <p className="text-2xl font-bold text-black">
                  {jobPosts.filter((job) => job.jobStatus === "Active").length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <Briefcase className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Inactive Jobs</p>
                <p className="text-2xl font-bold text-black">
                  {jobPosts.filter((job) => job.jobStatus === "Inactive").length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <Users className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Premium Jobs</p>
                <p className="text-2xl font-bold text-black">{jobPosts.filter((job) => job.isPremiumJob).length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <Crown className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Left Buttons */}
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <Link href={jobPostsThisMonth >= (userHasPremium ? 5 : 2) ? "#" : "/dashboard/employer/job-post/create"}>
            <Button
              className="bg-black hover:bg-gray-800 w-full xs:w-40 text-white h-11 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={jobPostsThisMonth >= (userHasPremium ? 5 : 2)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>

        {/* Quota and reset info */}
        <div className="mt-3 sm:mt-0 text-sm text-gray-600 text-left sm:text-right w-full sm:w-auto">
          <p className="font-medium">
            Job Posts this month:{" "}
            <span className="text-black">
              {jobPostsThisMonth}/{userHasPremium ? 5 : 2}
            </span>
          </p>
          {resetDate &&
            (() => {
              const [datePart, timePart] = resetDate.split(" ") // "01/09/2025" , "00:00"
              const [day, month, year] = datePart.split("/")
              const formatted = `${day}/${month}/${year} ${timePart}`
              return <p className="text-gray-500 break-words">Next reset: {formatted}</p>
            })()}
        </div>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search job posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border border-gray-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Posts */}
      <div className="space-y-4">
        {filteredPosts.map((job, index) => (
          <Card
            key={job.job_post_id ?? `job-${index}`}
            className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 min-w-0 max-w-4xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-black break-words">{job.jobTitle}</h3>
                        {job.isPremiumJob && (
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 flex-shrink-0">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="max-w-2xl">
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2 break-words overflow-hidden">
                          {job.jobDescription}
                        </p>
                      </div>
                      <Badge className={getStatusColor(job.jobStatus)}>{job.jobStatus}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{job.preferredPayrate}/hr</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{job.applicationsCount} applications</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{job.hoursContributionPerWeek}h/week</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 sm:col-span-2 xl:col-span-1">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">
                        Expires:&nbsp;
                        {job.jobExpirationDate
                          ? new Date(job.jobExpirationDate).toLocaleString("en-GB", {
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillTags.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 break-words">
                    Posted: &nbsp;
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}{" "}
                    • {job.duration}
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2 lg:ml-4 w-full lg:w-auto">
                  <Link href={`/dashboard/employer/job-post/${job.job_post_id}`} className="flex-1 lg:flex-none">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-200 bg-transparent hover:bg-gray-50 w-full"
                    >
                      View Details
                    </Button>
                  </Link>
                  {job.jobStatus === "Expired" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-200 bg-transparent w-full lg:w-auto cursor-not-allowed opacity-50 flex-1 lg:flex-none"
                      disabled
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <Link href={`/dashboard/employer/job-post/${job.job_post_id}/edit`} className="flex-1 lg:flex-none">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-gray-200 bg-transparent hover:bg-gray-50 w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <Card className="border border-gray-200 shadow-sm bg-white max-w-4xl mx-auto">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job posts found</h3>
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 mb-4 break-words">
                You haven't posted any jobs yet or no jobs match your search criteria.
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
              variant="outline"
              className="border border-gray-200 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

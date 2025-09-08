"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, Clock, DollarSign, TrendingUp, Target, Zap, Search, Briefcase } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface RecommendedJob {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  match: number
  skills: string[]
  posted: string
  employerId?: string
}

export default function RecommendedJobsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([])
  const [loading, setLoading] = useState<boolean>(true) // Set initial loading to true

  useEffect(() => {
    const fetchTopJobs = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${backendUrl}/api/match/top-jobs`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch job matches")
        }

        const data = await res.json()

        const normalized: RecommendedJob[] = data.map((job: any) => ({
          id: job.jobPost.jobPostId,
          title: job.jobPost.jobTitle,
          company: job.jobPost.companyName ?? "Unknown Company",
          location: job.jobPost.jobLocation,
          type: job.jobPost.jobCategory,
          salary: job.jobPost.preferredPayrate ? `${job.jobPost.preferredPayrate} / Hour` : "N/A",
          match: job.matchScore ?? 0,
          employerId: job.jobPost.employerId,
          skills: Array.isArray(job.skills)
            ? job.skills
            : typeof job.skillTags === "string"
              ? job.skillTags.split(",").map((s: string) => s.trim())
              : [],
          posted: new Date(job.jobPost.createdAt).toLocaleDateString(),
        }))

        setRecommendedJobs(normalized)
        console.log(normalized)
      } catch (err: any) {
        console.error("Error fetching job matches:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopJobs()
  }, [])

  const JobCardsLoading = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border border-gray-200 shadow-md bg-white rounded-xl">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-2 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-11 bg-gray-200 rounded-lg w-32"></div>
                  <div className="h-11 bg-gray-200 rounded-lg w-32"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const NoDataFound = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">No Recommended Jobs Found</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We couldn't find any jobs that match your profile right now. Try updating your skills or check back later for
        new opportunities.
      </p>
    </div>
  )

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Recommended Jobs Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Recommended Jobs</h1>
      </div>

      {/* AI Insights - Always visible */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">AI Powered</h3>
              <p className="text-sm text-gray-600">Use AI Powered System to Match Job Requirements with Your Profile</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Skill Match</h3>
              <p className="text-sm text-gray-600">Match Your Profile Skill Based on Percentage with Posted Jobs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Quick Apply</h3>
              <p className="text-sm text-gray-600">Quickly Overview and Apply to Jobs that Match your Profile</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <JobCardsLoading />
      ) : recommendedJobs.length === 0 ? (
        <NoDataFound />
      ) : (
        /* Recommended Jobs */
        <div className="space-y-4">
          {recommendedJobs.map((job, index) => (
            <Card
              key={job.id ?? `job-${index}`}
              className="border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        </div>
                        <p className="text-gray-600 font-semibold text-lg mb-2">{job.company}</p>
                        {/* Match Score */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-black fill-current" />
                            <span className="font-bold text-gray-900">{job.match}% Match</span>
                          </div>
                          <Progress value={job.match} className="w-32 h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">
                          {job.location
                            ?.split(",")
                            .map((c: string) => (c.trim().toLowerCase() === "global" ? "Global" : c.trim()))
                            .join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {job.type
                            ?.split(",")
                            .map((c: string) => c.trim())
                            .join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <span className="text-gray-500">Posted {job.posted}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string, index: number) => (
                        <Badge
                          key={`${skill}-${index}`}
                          className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-3 py-1 rounded-lg"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:ml-6">
                    <Link
                      href={`/dashboard/freelancer/job-search?id=${job.id}`}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      <Button className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold w-full">
                        Quick Apply
                      </Button>
                    </Link>

                    <Link
                      href={`/dashboard/view-profile/employer?userId=${job.employerId}`}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      <Button
                        variant="outline"
                        className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold w-full"
                      >
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

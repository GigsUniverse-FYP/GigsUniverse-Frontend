"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, DollarSign, MessageCircle, Eye, Briefcase, Target, TrendingUp, Zap, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "react-toastify"

export interface RecommendedTalent {
  id: string
  name: string
  title: string
  location: string
  hourlyRate: number | null
  rating: number
  completedJobs: number
  match: number
  skills: string[]
  avatar: string | null
  jobPostId?: number
}

export default function RecommendedTalentsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [recommendedTalents, setRecommendedTalents] = useState<RecommendedTalent[]>([])

  const [loading, setLoading] = useState<boolean>(true)

  const [selectedTalentID, setSelectedTalentID] = useState<string | null>(null)
  const [selectedJobID, setSelectedJobID] = useState<number | null>(null)

  const [showConfirm, setShowConfirm] = useState(false)

  const sendInvitation = async (freelancerUserId: string, jobPostId: number) => {
    try {
      if (!jobPostId) {
        toast.error("This talent cannot be invited: missing job reference")
        return
      }
      const res = await fetch(`${backendUrl}/api/match/send-invite`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ freelancerUserId, jobPostId }),
      })

      if (!res.ok) {
        throw new Error("Failed to send invite")
      }

      const data = await res.json()
      toast.success("Invitation sent successfully!")
      return data
    } catch (err) {
      console.error("Error sending invite:", err)
      toast.error("Failed to send invitation. Please try again.")
      throw err
    }
  }

  useEffect(() => {
    const fetchTopTalents = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/match/top-talents`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch top talents")
        }

        const data = await res.json()

        const normalized: RecommendedTalent[] = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          title: t.title,
          location: t.location,
          hourlyRate: t.hourlyRate,
          rating: t.rating ?? 0,
          completedJobs: t.completedJobs ?? 0,
          match: t.match ?? 0,
          skills: Array.isArray(t.skills)
            ? t.skills
            : typeof t.skillTags === "string"
              ? t.skillTags.split(",").map((s: string) => s.trim())
              : [],
          avatar: t.avatar ?? null,
          jobPostId: t.jobId ?? null,
        }))

        setRecommendedTalents(normalized)
        console.log(normalized)
      } catch (err: any) {
        console.error("Error fetching recommended talents:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopTalents()
  }, [])

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Recommended Talents Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Recommended Talents</h1>
      </div>

      {/* AI Insights */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI-Powered Talent Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Based on Your Jobs</h3>
              <p className="text-sm text-gray-600">Matched against all your active job postings</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Quality Score</h3>
              <p className="text-sm text-gray-600">All talents have 4.0+ ratings and proven track records</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Quick Hire</h3>
              <p className="text-sm text-gray-600">Send invitations directly to top-matched talents</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talent Cards */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={`skeleton-${index}`} className="border border-gray-200 shadow-md bg-white rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
                          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-64"></div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            <div className="h-2 bg-gray-200 rounded animate-pulse w-32"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:ml-6">
                      <div className="h-11 bg-gray-200 rounded-lg animate-pulse w-40"></div>
                      <div className="h-11 bg-gray-200 rounded-lg animate-pulse w-40"></div>
                      <div className="h-11 bg-gray-200 rounded-lg animate-pulse w-40"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recommendedTalents.length === 0 ? (
          // No data found state
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Recommended Talents Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any talents that match your current job requirements. Try posting more jobs or
                adjusting your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          recommendedTalents.map((talent, index) => (
            <Card
              key={`talent-${index}`}
              className="border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                          {talent.avatar ? (
                            <img
                              src={talent.avatar || "/placeholder.svg"}
                              alt={talent.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                              {talent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{talent.name}</h3>
                        </div>
                        <p className="text-gray-600 font-semibold text-lg mb-2">{talent.title}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-black fill-current" />
                            <span className="font-bold text-gray-900">{talent.rating}</span>
                          </div>
                          <Progress value={talent.match} className="w-32 h-2" />
                          <span className="font-bold text-gray-900">{talent.match}% Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{talent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">{talent.hourlyRate} / Hour</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span className="font-medium">{talent.completedJobs} Jobs Completed</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {talent.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-3 py-1 rounded-lg"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:ml-6">
                    <Button
                      className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold w-full cursor-pointer"
                      onClick={() => {
                        setSelectedTalentID(talent.id)
                        setSelectedJobID(talent.jobPostId!)
                        setShowConfirm(true)
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invite
                    </Button>

                    <Link
                      href={`/dashboard/employer/chat?userId=${talent.id}`}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900 h-11 rounded-lg font-semibold w-full cursor-pointer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat With Talent
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/view-profile/freelancer?userId=${talent.id}`}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      <Button
                        variant="outline"
                        className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold w-full cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Job Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send job invitation to this talent?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedTalentID && selectedJobID) {
                  sendInvitation(selectedTalentID, selectedJobID)
                }
              }}
              className="bg-black hover:bg-gray-800 cursor-pointer text-white"
            >
              Send Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Search,
  Filter,
  MessageCircle,
  Heart,
  Eye,
  Award,
  Users,
  Briefcase,
} from "lucide-react"

const recommendedTalents = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior React Developer",
    location: "San Francisco, CA",
    hourlyRate: 85,
    rating: 4.9,
    completedJobs: 47,
    match: 96,
    reason: "Perfect match for your React development projects",
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
    avatar: "SJ",
    responseTime: "Usually responds within 2 hours",
    availability: "Available now",
    topRated: true,
    lastActive: "Online now",
  },
  {
    id: 2,
    name: "Mike Chen",
    title: "Full Stack Engineer",
    location: "Remote",
    hourlyRate: 75,
    rating: 4.8,
    completedJobs: 32,
    match: 92,
    reason: "Strong background in your required tech stack",
    skills: ["JavaScript", "Python", "AWS", "Docker"],
    avatar: "MC",
    responseTime: "Usually responds within 4 hours",
    availability: "Available in 1 week",
    topRated: true,
    lastActive: "2 hours ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "UI/UX Designer",
    location: "New York, NY",
    hourlyRate: 65,
    rating: 4.7,
    completedJobs: 28,
    match: 89,
    reason: "Excellent design portfolio matching your project needs",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    avatar: "ER",
    responseTime: "Usually responds within 6 hours",
    availability: "Available now",
    topRated: false,
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Alex Thompson",
    title: "Mobile App Developer",
    location: "Austin, TX",
    hourlyRate: 70,
    rating: 4.6,
    completedJobs: 19,
    match: 85,
    reason: "Specialized in React Native development",
    skills: ["React Native", "iOS", "Android", "Firebase"],
    avatar: "AT",
    responseTime: "Usually responds within 8 hours",
    availability: "Available in 2 weeks",
    topRated: false,
    lastActive: "3 hours ago",
  },
]

export default function RecommendedTalentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [rateFilter, setRateFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const filteredTalents = recommendedTalents.filter((talent) => {
    const matchesSearch =
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkill =
      skillFilter === "all" || talent.skills.some((skill) => skill.toLowerCase().includes(skillFilter))
    const matchesRate =
      rateFilter === "all" ||
      (rateFilter === "50" && talent.hourlyRate >= 50) ||
      (rateFilter === "75" && talent.hourlyRate >= 75) ||
      (rateFilter === "100" && talent.hourlyRate >= 100)
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "now" && talent.availability.includes("now")) ||
      (availabilityFilter === "week" && talent.availability.includes("week"))

    return matchesSearch && matchesSkill && matchesRate && matchesAvailability
  })

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
              <p className="text-sm text-gray-600">Matched against your 12 active job postings</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Quality Score</h3>
              <p className="text-sm text-gray-600">All talents have 4.5+ ratings and proven track records</p>
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

      {/* Search and Filters */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Find the Perfect Talent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search talents, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border border-gray-200 h-11 rounded-lg"
              />
            </div>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rateFilter} onValueChange={setRateFilter}>
              <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
                <SelectValue placeholder="Hourly Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rate</SelectItem>
                <SelectItem value="50">$50+ /hour</SelectItem>
                <SelectItem value="75">$75+ /hour</SelectItem>
                <SelectItem value="100">$100+ /hour</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Availability</SelectItem>
                <SelectItem value="now">Available Now</SelectItem>
                <SelectItem value="week">Within 1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredTalents.length}</span> recommended talents
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border border-gray-200 bg-white hover:bg-gray-50 h-9 rounded-lg"
          >
            <Filter className="h-4 w-4 mr-1" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Talent Cards */}
      <div className="space-y-4">
        {filteredTalents.length > 0 ? (
          filteredTalents.map((talent) => (
            <Card
              key={talent.id}
              className="border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="font-bold text-gray-700 text-lg">{talent.avatar}</span>
                        </div>
                        {talent.topRated && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{talent.name}</h3>
                          {talent.topRated && (
                            <Badge className="bg-black text-white rounded-lg text-xs">Top Rated</Badge>
                          )}
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
                        <p className="text-sm text-gray-700 mb-4 italic bg-gray-50 p-3 rounded-lg border-l-4 border-black">
                          "{talent.reason}"
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{talent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">${talent.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span className="font-medium">{talent.completedJobs} jobs completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{talent.lastActive}</span>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{talent.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>{talent.availability}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[160px]">
                    <Button className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Invite
                    </Button>
                    <Button
                      variant="outline"
                      className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 rounded-lg"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No talents found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We couldn't find any talents matching your current search criteria. Try adjusting your filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSkillFilter("all")
                    setRateFilter("all")
                    setAvailabilityFilter("all")
                  }}
                  className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Load More */}
      {filteredTalents.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="border border-gray-200 bg-white hover:bg-gray-50 h-11 px-8 rounded-lg font-semibold"
          >
            Load More Talents
          </Button>
        </div>
      )}
    </div>
  )
}

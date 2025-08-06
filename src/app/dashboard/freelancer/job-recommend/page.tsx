"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, Clock, DollarSign, TrendingUp, Target, Zap } from "lucide-react"

const recommendedJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "InnovateTech",
    location: "Remote",
    type: "Full-time",
    salary: "$95,000 - $130,000",
    match: 95,
    reason: "Perfect match for your React and TypeScript skills",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    posted: "1 day ago",
    urgent: true,
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "DataFlow Systems",
    location: "San Francisco, CA",
    type: "Contract",
    salary: "$80 - $100/hour",
    match: 88,
    reason: "Your Node.js experience is highly valued here",
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    posted: "2 days ago",
    urgent: false,
  },
  {
    id: 3,
    title: "React Native Developer",
    company: "MobileFirst Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$85,000 - $115,000",
    match: 82,
    reason: "Great opportunity to expand into mobile development",
    skills: ["React Native", "JavaScript", "iOS", "Android"],
    posted: "3 days ago",
    urgent: false,
  },
  {
    id: 4,
    title: "UI/UX Developer",
    company: "DesignCorp",
    location: "New York, NY",
    type: "Part-time",
    salary: "$60 - $80/hour",
    match: 75,
    reason: "Your design skills complement your development expertise",
    skills: ["Figma", "React", "CSS", "Design Systems"],
    posted: "1 week ago",
    urgent: false,
  },
]

export default function RecommendedJobsPage() {
  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Recommended Jobs Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Recommended Jobs</h1>
      </div>

      {/* AI Insights */}
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
              <h3 className="font-bold text-gray-900 mb-1">Market Trends</h3>
              <p className="text-sm text-gray-600">React developers are in high demand with 23% salary increase</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Skill Match</h3>
              <p className="text-sm text-gray-600">Your profile matches 95% with top React positions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Quick Apply</h3>
              <p className="text-sm text-gray-600">Apply to 5+ jobs with one click using your profile</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <div className="space-y-4">
        {recommendedJobs.map((job) => (
          <Card
            key={job.id}
            className="border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        {job.urgent && (
                          <Badge className="bg-black text-white rounded-lg">
                            <Zap className="h-3 w-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
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
                      <p className="text-sm text-gray-700 mb-4 italic bg-gray-50 p-3 rounded-lg border-l-4 border-black">
                        "{job.reason}"
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    <span className="text-gray-500">Posted {job.posted}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-3 py-1 rounded-lg"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[140px]">
                  <Button className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold">
                    Quick Apply
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 rounded-lg"
                  >
                    Not Interested
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border border-gray-200 bg-white hover:bg-gray-50 mb-5 h-11 px-8 rounded-lg font-semibold"
        >
          Load More Recommendations
        </Button>
      </div>
    </div>
  )
}

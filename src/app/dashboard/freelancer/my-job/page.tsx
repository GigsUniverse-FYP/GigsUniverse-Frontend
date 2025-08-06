"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, MessageCircle, FileText, CheckCircle, AlertCircle, Star } from "lucide-react"

const activeJobs = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    client: "TechCorp Inc.",
    status: "In Progress",
    progress: 75,
    deadline: "Dec 15, 2024",
    budget: "$2,500",
    timeSpent: "32h",
    description: "Complete redesign of the company's e-commerce platform with modern UI/UX",
    lastUpdate: "2 hours ago",
    priority: "high",
  },
  {
    id: 2,
    title: "Mobile App Development",
    client: "StartupXYZ",
    status: "Review",
    progress: 90,
    deadline: "Dec 20, 2024",
    budget: "$4,200",
    timeSpent: "58h",
    description: "React Native app for iOS and Android with real-time features",
    lastUpdate: "1 day ago",
    priority: "medium",
  },
  {
    id: 3,
    title: "Dashboard Analytics",
    client: "DataFlow Systems",
    status: "Planning",
    progress: 25,
    deadline: "Jan 10, 2025",
    budget: "$1,800",
    timeSpent: "12h",
    description: "Business intelligence dashboard with data visualization components",
    lastUpdate: "3 days ago",
    priority: "low",
  },
]

const completedJobs = [
  {
    id: 4,
    title: "Brand Identity Package",
    client: "Creative Agency",
    completedDate: "Dec 10, 2024",
    budget: "$3,200",
    timeSpent: "45h",
    rating: 5,
    feedback: "Exceptional work! The brand identity perfectly captures our vision.",
  },
  {
    id: 5,
    title: "Landing Page Optimization",
    client: "MarketingPro",
    completedDate: "Nov 28, 2024",
    budget: "$1,500",
    timeSpent: "28h",
    rating: 5,
    feedback: "Great attention to detail and fast delivery. Highly recommended!",
  },
]

export default function MyJobsPage() {
  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* My Jobs Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">My Jobs</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <Clock className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$8,500</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <DollarSign className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hours Logged</p>
                <p className="text-2xl font-bold text-gray-900">102</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <Clock className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.9</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <Star className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <Tabs defaultValue="active" className="w-full">
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg h-11">
              <TabsTrigger value="active" className="data-[state=active]:bg-white font-semibold rounded-md">
                Active Jobs ({activeJobs.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-white font-semibold rounded-md">
                Completed ({completedJobs.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="active" className="mt-0">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-8 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 font-semibold text-lg">{job.client}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`font-semibold rounded-lg px-3 py-1 ${
                                job.status === "In Progress"
                                  ? "bg-black text-white"
                                  : job.status === "Review"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {job.status}
                            </Badge>
                            {job.priority === "high" && <AlertCircle className="h-4 w-4 text-red-500" />}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Due: {job.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Budget: {job.budget}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Time: {job.timeSpent}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">Progress</span>
                              <span className="text-sm font-semibold text-gray-900">{job.progress}%</span>
                            </div>
                            <Progress value={job.progress} className="h-2 bg-gray-200 rounded-full" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Last updated: {job.lastUpdate}</p>
                      </div>
                      <div className="flex flex-col gap-3 lg:ml-6 lg:w-[180px]">
                        <Button className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Client
                        </Button>
                        <Button
                          variant="outline"
                          className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 rounded-lg"
                        >
                          Update Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {completedJobs.map((job) => (
                  <div key={job.id} className="p-8 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 font-semibold text-lg">{job.client}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border border-green-200 font-semibold rounded-lg px-3 py-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Completed: {job.completedDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Earned: {job.budget}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">Time: {job.timeSpent}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-700">Client Feedback:</span>
                            <div className="flex">
                              {[...Array(job.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-black fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic leading-relaxed">"{job.feedback}"</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 lg:ml-6 lg:w-[180px]">
                        <Button
                          variant="outline"
                          className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Invoice
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 rounded-lg"
                        >
                          Download Files
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

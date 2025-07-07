"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  Users,
  Eye,
  Edit,
  Search,
  Calendar,
  DollarSign,
  Clock,
  Star,
  MessageCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Plus,
  Filter,
  MoreHorizontal,
} from "lucide-react"

const jobPosts = [
  {
    id: 1,
    title: "Senior React Developer",
    description: "We're looking for an experienced React developer to build a modern e-commerce platform...",
    budget: 15000,
    budgetType: "Fixed",
    status: "Active",
    postedDate: "Dec 5, 2024",
    deadline: "Dec 20, 2024",
    applicationsCount: 24,
    viewsCount: 156,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experienceLevel: "Expert",
    duration: "3-6 months",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    description: "Looking for a creative designer to redesign our mobile app interface...",
    budget: 75,
    budgetType: "Hourly",
    status: "Active",
    postedDate: "Dec 3, 2024",
    deadline: "Dec 25, 2024",
    applicationsCount: 18,
    viewsCount: 89,
    skills: ["Figma", "Adobe Creative Suite", "Prototyping"],
    experienceLevel: "Intermediate",
    duration: "1-3 months",
  },
  {
    id: 3,
    title: "Content Writer",
    description: "Need a skilled writer for blog posts and marketing content...",
    budget: 1200,
    budgetType: "Fixed",
    status: "Draft",
    postedDate: "Dec 1, 2024",
    deadline: "Dec 30, 2024",
    applicationsCount: 0,
    viewsCount: 0,
    skills: ["Content Writing", "SEO", "Marketing"],
    experienceLevel: "Intermediate",
    duration: "Less than 1 month",
  },
  {
    id: 4,
    title: "Mobile App Developer",
    description: "Develop a cross-platform mobile app using React Native...",
    budget: 12000,
    budgetType: "Fixed",
    status: "Closed",
    postedDate: "Nov 20, 2024",
    deadline: "Dec 15, 2024",
    applicationsCount: 31,
    viewsCount: 203,
    skills: ["React Native", "iOS", "Android"],
    experienceLevel: "Expert",
    duration: "3-6 months",
  },
]

const applications = [
  {
    id: 1,
    jobTitle: "Senior React Developer",
    jobId: 1,
    freelancer: {
      name: "Sarah Johnson",
      avatar: "SJ",
      title: "Senior React Developer",
      location: "San Francisco, CA",
      rating: 4.9,
      completedJobs: 47,
      hourlyRate: 85,
    },
    appliedDate: "Dec 8, 2024",
    status: "Under Review",
    proposedRate: 80,
    coverLetter: "I'm excited to work on your e-commerce platform. With 5+ years of React experience...",
    estimatedDuration: "4 months",
    availability: "Available immediately",
  },
  {
    id: 2,
    jobTitle: "Senior React Developer",
    jobId: 1,
    freelancer: {
      name: "Mike Chen",
      avatar: "MC",
      title: "Full Stack Developer",
      location: "Remote",
      rating: 4.8,
      completedJobs: 32,
      hourlyRate: 75,
    },
    appliedDate: "Dec 7, 2024",
    status: "Shortlisted",
    proposedRate: 75,
    coverLetter: "Your project aligns perfectly with my expertise in React and e-commerce solutions...",
    estimatedDuration: "3-4 months",
    availability: "Available in 1 week",
  },
  {
    id: 3,
    jobTitle: "UI/UX Designer",
    jobId: 2,
    freelancer: {
      name: "Emily Rodriguez",
      avatar: "ER",
      title: "UI/UX Designer",
      location: "New York, NY",
      rating: 4.7,
      completedJobs: 28,
      hourlyRate: 65,
    },
    appliedDate: "Dec 6, 2024",
    status: "Interview Scheduled",
    proposedRate: 70,
    coverLetter: "I'd love to help redesign your mobile app. My portfolio includes similar projects...",
    estimatedDuration: "2 months",
    availability: "Available now",
    interviewDate: "Dec 12, 2024 at 2:00 PM",
  },
  {
    id: 4,
    jobTitle: "Senior React Developer",
    jobId: 1,
    freelancer: {
      name: "Alex Thompson",
      avatar: "AT",
      title: "React Developer",
      location: "Austin, TX",
      rating: 4.6,
      completedJobs: 19,
      hourlyRate: 70,
    },
    appliedDate: "Dec 5, 2024",
    status: "Rejected",
    proposedRate: 65,
    coverLetter: "I have experience building e-commerce platforms with React...",
    estimatedDuration: "5 months",
    availability: "Available in 2 weeks",
    rejectionReason: "Looking for someone with more e-commerce experience",
  },
]

export default function JobPostsApplicationsPage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Draft":
        return "bg-gray-100 text-gray-700 border border-gray-200"
      case "Closed":
        return "bg-red-100 text-red-800 border border-red-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "Shortlisted":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "Interview Scheduled":
        return "bg-black text-white"
      case "Rejected":
        return "bg-gray-100 text-gray-600 border border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const filteredPosts = jobPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mb-5">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Job Posts & Applications</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
                <p className="text-2xl font-bold text-black">{jobPosts.length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Briefcase className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-black">
                  {jobPosts.filter((job) => job.status === "Active").length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Eye className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-black">{applications.length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-black">
                  {applications.filter((app) => app.status === "Under Review").length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="posts" className="font-semibold rounded-md h-10">
            Job Posts ({jobPosts.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="font-semibold rounded-md h-10">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card className="border border-gray-200 shadow-sm bg-white mt-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search ${activeTab === "posts" ? "job posts" : "applications"}...`}
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  {activeTab === "posts" ? (
                    <>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="posts" className="space-y-4">
          {/* Post New Job Button */}
          <div className="flex justify-end">
            <Button className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {/* Job Posts */}
          {filteredPosts.map((job) => (
            <Card key={job.id} className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-black mb-1">{job.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {job.budgetType === "Fixed" ? `$${job.budget.toLocaleString()}` : `$${job.budget}/hr`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.applicationsCount} applications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.viewsCount} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Due: {job.deadline}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Posted: {job.postedDate} • {job.experienceLevel} • {job.duration}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-200 bg-transparent hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-200 bg-transparent hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-200 bg-transparent hover:bg-gray-50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {/* Applications */}
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="font-semibold text-gray-700 text-sm">{application.freelancer.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-black">{application.freelancer.name}</h3>
                          <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                        </div>
                        <p className="text-gray-600 font-medium mb-1">{application.freelancer.title}</p>
                        <p className="text-sm text-gray-600 mb-2">Applied for: {application.jobTitle}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-black fill-current" />
                            <span>{application.freelancer.rating}</span>
                          </div>
                          <span>{application.freelancer.completedJobs} jobs</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{application.freelancer.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Proposed Rate</p>
                        <p className="font-semibold text-gray-900">${application.proposedRate}/hr</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">{application.estimatedDuration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Availability</p>
                        <p className="font-semibold text-gray-900">{application.availability}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Applied</p>
                        <p className="font-semibold text-gray-900">{application.appliedDate}</p>
                      </div>
                    </div>

                    {/* Special Status Information */}
                    {application.status === "Interview Scheduled" && application.interviewDate && (
                      <div className="bg-black text-white p-3 rounded-lg mb-4">
                        <p className="font-medium">Interview Scheduled</p>
                        <p className="text-sm">{application.interviewDate}</p>
                      </div>
                    )}
                    {application.status === "Rejected" && application.rejectionReason && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="font-medium text-gray-700 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-gray-600">{application.rejectionReason}</p>
                      </div>
                    )}

                    <details className="group">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-black">
                        View cover letter
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{application.coverLetter}</p>
                      </div>
                    </details>
                  </div>
                  <div className="flex flex-col gap-2 lg:ml-4">
                    {application.status === "Under Review" && (
                      <>
                        <Button className="bg-black hover:bg-gray-800 text-white h-9 rounded-lg">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Shortlist
                        </Button>
                        <Button
                          variant="outline"
                          className="border border-gray-200 bg-transparent hover:bg-gray-50 h-9 rounded-lg"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "Shortlisted" && (
                      <Button className="bg-black hover:bg-gray-800 text-white h-9 rounded-lg">
                        Schedule Interview
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border border-gray-200 bg-transparent hover:bg-gray-50 h-9 rounded-lg"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black h-8 rounded-lg">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Empty States */}
      {((activeTab === "posts" && filteredPosts.length === 0) ||
        (activeTab === "applications" && filteredApplications.length === 0)) && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === "posts" ? (
                <Briefcase className="w-8 h-8 text-gray-400" />
              ) : (
                <Users className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === "posts" ? "job posts" : "applications"} found
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "posts"
                ? "You haven't posted any jobs yet or no jobs match your search criteria."
                : "No applications match your current search criteria."}
            </p>
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

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, DollarSign, Eye, MessageCircle, Search, Filter } from "lucide-react"
import { useState } from "react"

const applications = [
  {
    id: 1,
    jobTitle: "Senior React Developer",
    company: "TechCorp Inc.",
    appliedDate: "Dec 8, 2024",
    status: "Under Review",
    salary: "$80,000 - $120,000",
    location: "Remote",
    type: "Full-time",
    lastUpdate: "2 days ago",
    responseTime: "Usually responds within 3 days",
    coverLetter: "I am excited to apply for the Senior React Developer position...",
  },
  {
    id: 2,
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    appliedDate: "Dec 5, 2024",
    status: "Interview Scheduled",
    salary: "$90,000 - $130,000",
    location: "San Francisco, CA",
    type: "Full-time",
    lastUpdate: "1 day ago",
    responseTime: "Fast responder",
    interviewDate: "Dec 12, 2024 at 2:00 PM",
    coverLetter: "Your company's mission aligns perfectly with my career goals...",
  },
  {
    id: 3,
    jobTitle: "Frontend Developer",
    company: "DesignStudio",
    appliedDate: "Dec 3, 2024",
    status: "Rejected",
    salary: "$70,000 - $90,000",
    location: "New York, NY",
    type: "Contract",
    lastUpdate: "3 days ago",
    responseTime: "Usually responds within 1 week",
    feedback: "We decided to move forward with a candidate with more design experience.",
    coverLetter: "I would love to contribute to your creative team...",
  },
  {
    id: 4,
    jobTitle: "React Native Developer",
    company: "MobileFirst",
    appliedDate: "Nov 30, 2024",
    status: "Offer Received",
    salary: "$85,000 - $115,000",
    location: "Remote",
    type: "Full-time",
    lastUpdate: "5 days ago",
    responseTime: "Fast responder",
    offerDeadline: "Dec 15, 2024",
    coverLetter: "I am passionate about mobile development and would love to join your team...",
  },
  {
    id: 5,
    jobTitle: "UI/UX Developer",
    company: "CreativeAgency",
    appliedDate: "Nov 28, 2024",
    status: "Application Sent",
    salary: "$60 - $80/hour",
    location: "Los Angeles, CA",
    type: "Freelance",
    lastUpdate: "1 week ago",
    responseTime: "Usually responds within 2 weeks",
    coverLetter: "My background in both development and design makes me a perfect fit...",
  },
]

export default function AppliedJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-gray-200 text-gray-800"
      case "Interview Scheduled":
        return "bg-black text-white"
      case "Rejected":
        return "bg-gray-100 text-gray-600"
      case "Offer Received":
        return "bg-black text-white"
      case "Application Sent":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Applied Jobs Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Applied Jobs</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-black">{applications.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Under Review</p>
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
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-black">
                  {applications.filter((app) => app.status === "Interview Scheduled").length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageCircle className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offers</p>
                <p className="text-2xl font-bold text-black">
                  {applications.filter((app) => app.status === "Offer Received").length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applications..."
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
                <SelectItem value="Application Sent">Application Sent</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Offer Received">Offer Received</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card
            key={application.id}
            className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-1">{application.jobTitle}</h3>
                      <p className="text-gray-600 font-medium">{application.company}</p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Applied: {application.appliedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{application.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{application.type}</span>
                    </div>
                    <div className="text-sm text-gray-600">{application.location}</div>
                  </div>

                  {/* Special Status Information */}
                  {application.status === "Interview Scheduled" && application.interviewDate && (
                    <div className="bg-black text-white p-3 rounded-lg mb-4">
                      <p className="font-medium">Interview Scheduled</p>
                      <p className="text-sm">{application.interviewDate}</p>
                    </div>
                  )}
                  {application.status === "Offer Received" && application.offerDeadline && (
                    <div className="bg-black text-white p-3 rounded-lg mb-4">
                      <p className="font-medium">Offer Received!</p>
                      <p className="text-sm">Respond by: {application.offerDeadline}</p>
                    </div>
                  )}
                  {application.status === "Rejected" && application.feedback && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="font-medium text-gray-700 mb-1">Feedback:</p>
                      <p className="text-sm text-gray-600">{application.feedback}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-2">
                    Last update: {application.lastUpdate} • {application.responseTime}
                  </div>
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
                  {application.status === "Interview Scheduled" && (
                    <Button className="bg-black hover:bg-gray-800 text-white">Join Interview</Button>
                  )}
                  {application.status === "Offer Received" && (
                    <>
                      <Button className="bg-black hover:bg-gray-800 text-white">Accept Offer</Button>
                      <Button variant="outline" className="border border-gray-200 bg-transparent">
                        Negotiate
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="border border-gray-200 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                    View Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" className="border border-gray-200 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

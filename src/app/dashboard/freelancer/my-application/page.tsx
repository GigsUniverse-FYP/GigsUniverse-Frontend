"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, DollarSign, Eye, MessageCircle, Search, Filter, FileText, LocateIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Application {
  id: number
  jobTitle: string
  jobPostId: number;
  company: string
  appliedDate: string
  status: string
  rejectReason: string
  jobExperience: string
  level: string
  salary: string
  salaryOffered: string
  location: string
  type: string
  proposal: string
  employerId: string
}

export default function AppliedJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [applications, setApplications] = useState<Application[]>([])

  const [contractStatuses, setContractStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchContractStatuses = async () => {
      const ids = applications
        .filter(app => app.status === "contract")
        .map(app => app.id);

      if (ids.length === 0) return;

      try {
        const res = await fetch(`${backendUrl}/api/contracts/statuses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(ids),
        });

        if (!res.ok) throw new Error("Failed to fetch contract statuses");

        const data: Record<string, string> = await res.json();
        setContractStatuses(data);

        console.log(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchContractStatuses();
  }, [applications, backendUrl]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/job-applications/freelancer/applications`,
          {
            credentials: "include",
          }
        )

        if (!res.ok) throw new Error("Failed to fetch applications")

        const data: Application[] = await res.json()
        setApplications(data)

        console.log(data)
      } catch (err) {
        console.error(err)
      } 
    }
    fetchApplications()
  }, [backendUrl])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shortlisted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "contract":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="w-full sm:max-w-8xl min-w-sm mx-auto space-y-6 mb-5 -ml-15 sm:ml-0">
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-black">
                  {applications.filter((app) => app.status === "pending").length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-black">
                  {applications.filter((app) => app.status === "shortlisted").length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contracts</p>
                <p className="text-2xl font-bold text-black">
                  {applications.filter((app) => app.status === "contract").length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-4 w-4 text-green-700" />
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
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
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{application.appliedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{application.salary}/hr</span>
                    </div>
                    <div className="flex items-center gap-2 w-45 truncate">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 truncate">{application.type.split(",").join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 w-45 truncate">
                      <LocateIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 truncate">
                        {application.location.toLowerCase() === "global"
                        ? "Global"
                        : "Hiring in Multiple Locations"
                        }
                      </span>
                    </div>
                  </div>

                  {/* Additional job details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Experience: </span>
                      <span className="text-gray-700">{application.jobExperience} years</span>
                    </div>
                    <div className="text-sm w-55 truncate">
                      <span className="text-gray-500">Level: </span>
                      <span className="text-gray-700 truncate">{application.level.split(",").join(", ")}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Your Rate: </span>
                      <span className="text-gray-700">{application.salaryOffered}/hr</span>
                    </div>
                  </div>

                  {application.status === "rejected" && application.rejectReason && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                      <p className="font-medium text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{application.rejectReason}</p>
                    </div>
                  )}

                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-black">View proposal</summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{application.proposal}</p>
                    </div>
                  </details>
                </div>

                <div className="flex flex-col gap-2 lg:ml-4">
                  {application.status === "contract" && (() => {
                    const status = contractStatuses[application.id]; 
                    if (!status) return null;

                    const baseStyles = "text-sm px-3 py-1 rounded-md font-semibold inline-flex items-center gap-1";

                    switch (status) {
                      case "pending":
                        return (
                          <Link href={`/dashboard/freelancer/my-application/contract?jobApplicationId=${application.id}`}>
                            <Button className={`${baseStyles} bg-green-600 hover:bg-green-700 text-white`}>
                              <FileText className="h-4 w-4" />
                              Open Contract
                            </Button>
                          </Link>
                        );
                      case "rejected":
                        return <Button className={`${baseStyles} bg-red-600 text-white cursor-default`}>Rejected</Button>;
                      case "upcoming":
                      case "active":
                        return <Button className={`${baseStyles} bg-green-600 text-white cursor-default`}>Accepted</Button>;
                      case "cancelled":
                        return <Button className={`${baseStyles} bg-yellow-500 text-white cursor-default`}>Cancelled</Button>;
                      case "completed":
                        return <Button className={`${baseStyles} bg-blue-600 text-white cursor-default`}>Completed</Button>;
                      default:
                        return null;
                    }
                  })()}

                  <Link href={`/dashboard/freelancer/chat?userId=${application.employerId}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border border-gray-200 w-full md:w-35 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  </Link>
                  <Link href={`/dashboard/freelancer/job-search?id=${application.jobPostId}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="text-gray-600 w-full md:w-35 hover:text-black">
                      View Job
                    </Button>
                  </Link>
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

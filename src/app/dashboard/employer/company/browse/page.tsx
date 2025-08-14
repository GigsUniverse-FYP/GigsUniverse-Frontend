"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  MapPin,
  Mail,
  Phone,
  Globe,
  Star,
  Eye,
  Search,
  ArrowLeft,
  Flag,
  Calendar,
  Briefcase,
  Play,
} from "lucide-react"
import Link from "next/link"

// Mock companies data
const mockCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    logo: "/placeholder.svg?height=60&width=60",
    industry: "Technology",
    location: "Kuala Lumpur, Malaysia",
    employees: "50-100",
    rating: 4.5,
    reviews: 127,
    description: "Leading technology solutions provider specializing in web development and digital transformation.",
    website: "https://techcorp.com",
    email: "contact@techcorp.com",
    phone: "+60 3-1234 5678",
    founded: "2020",
    address: "Level 15, Menara TM, Jalan Pantai Baharu, 50672 Kuala Lumpur",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    videos: [
      { title: "Company Culture Video", thumbnail: "/placeholder.svg?height=120&width=200" },
      { title: "Product Demo", thumbnail: "/placeholder.svg?height=120&width=200" },
    ],
    jobs: [
      { title: "Senior Developer", department: "Engineering", type: "Full-time" },
      { title: "UI/UX Designer", department: "Design", type: "Full-time" },
      { title: "Product Manager", department: "Product", type: "Full-time" },
    ],
  },
]

type Company = typeof mockCompanies[number];

export default function BrowseCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")

  const filteredCompanies = mockCompanies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleReportCompany = () => {
    if (reportReason && reportDetails) {
      console.log("Reporting company:", { reason: reportReason, details: reportDetails })
      setReportReason("")
      setReportDetails("")
      setShowReportDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/employer/company">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Company Management
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Companies</h1>
          <p className="text-gray-600">Discover companies and explore opportunities</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search companies..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="border border-gray-200 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={company.logo || "/placeholder.svg"} />
                    <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{company.employees}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{company.rating}</span>
                    <span className="text-sm text-gray-600">({company.reviews})</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCompany(company)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Details Dialog */}
        {selectedCompany && (
          <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedCompany.logo || "/placeholder.svg"} />
                      <AvatarFallback>{selectedCompany.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-2xl">{selectedCompany.name}</DialogTitle>
                      <p className="text-gray-600">{selectedCompany.industry}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{selectedCompany.rating}</span>
                        <span className="text-sm text-gray-600">({selectedCompany.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReportDialog(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Company Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{selectedCompany.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedCompany.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedCompany.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a href={selectedCompany.website} className="text-blue-600 hover:underline">
                          {selectedCompany.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Founded in {selectedCompany.founded}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{selectedCompany.employees} employees</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">About</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedCompany.description}</p>
                  </div>
                </div>

                {/* Company Images */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Office Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCompany.images?.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Office ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Videos */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCompany.videos?.map((video, index) => (
                      <div
                        key={index}
                        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                          <p className="text-white text-sm font-medium">{video.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Open Positions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Open Positions</h3>
                  <div className="space-y-3">
                    {selectedCompany.jobs?.map((job, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-gray-600">
                              {job.department} • {job.type}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Report Company Dialog */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Company</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reason for reporting</label>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                    <SelectItem value="fake">Fake Company</SelectItem>
                    <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                    <SelectItem value="spam">Spam or Misleading</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Additional details</label>
                <Textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please provide more details about your report..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleReportCompany}
                  disabled={!reportReason || !reportDetails}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

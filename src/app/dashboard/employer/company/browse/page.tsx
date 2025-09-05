"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, MapPin, Mail, Phone, Globe, Eye, Search, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

type FileData = {
  fileName: string
  contentType: string
  fileBytes: string
}

type VerifiedCompanyDTO = {
  company: {
    companyId: number
    companyName: string
    industryType: string
    companyDescription: string
    companySize: string
    businessEmail: string
    businessPhoneNumber: string
    registeredCompanyAddress: string
    officialWebsiteUrl: string
    registrationDate: string
  }
  attachment?: {
    companyLogo?: FileData
    companyCert?: FileData
    businessLicense?: FileData
  }
  image?: {
    companyImages: FileData[]
  }
  video?: {
    companyVideo: FileData
  }
}

type Company = {
  id: number
  name: string
  logo: string | null
  industry: string
  location: string
  employees: string
  description: string
  website: string
  email: string
  phone: string
  founded: string
  address: string
  images: string[]
  videos: { title: string; src: string }[]
}

export default function BrowseCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Fetch verified companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/company/verified-companies`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch company data")

        const data: VerifiedCompanyDTO[] = await res.json()

        // Map DTO to frontend Company structure
        const mapped: Company[] = data.map((dto) => {
          const c = dto.company
          return {
            id: c.companyId,
            name: c.companyName,
            logo: dto.attachment?.companyLogo
              ? `data:${dto.attachment.companyLogo.contentType};base64,${dto.attachment.companyLogo.fileBytes}`
              : null,
            industry: c.industryType,
            location: c.registeredCompanyAddress || "N/A",
            employees: c.companySize || "N/A",
            description: c.companyDescription,
            website: c.officialWebsiteUrl || "",
            email: c.businessEmail,
            phone: c.businessPhoneNumber,
            founded: c.registrationDate ? new Date(c.registrationDate).toISOString().split("T")[0] : "N/A",
            address: c.registeredCompanyAddress || "N/A",
            images: dto.image?.companyImages?.map((img) => `data:${img.contentType};base64,${img.fileBytes}`) || [],
            videos: dto.video?.companyVideo
              ? [
                  {
                    title: "Company Video",
                    src: `data:${dto.video.companyVideo.contentType};base64,${dto.video.companyVideo.fileBytes}`,
                  },
                ]
              : [],
          }
        })

        setCompanies(mapped)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCompanies()
  }, [backendUrl])

  // Search filter
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6 -ml-20 sm:ml-0">
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

        {/* Search */}
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

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="border border-gray-200 bg-white rounded-xl hover:shadow-md transition-shadow h-64 flex flex-col"
              >
                <CardContent className="p-6 flex-1 flex flex-col w-[500px]">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={company.logo || "/public/images/placeholder.jpg"} />
                      <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate w-[250px]">{company.name}</h3>
                      <p className="text-sm text-gray-600 truncate w-[250px]">{company.industry}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate w-[300px]">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{company.employees}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
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
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-6">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Companies Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No companies match your search for "${searchTerm}". Try adjusting your search terms.`
                    : "No verified companies are currently available. Please check back later."}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}
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
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Company Info */}
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
                        <a
                          href={selectedCompany.website}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
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

                {/* Images */}
                {selectedCompany.images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Office Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedCompany.images.map((image, index) => (
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
                )}

                {/* Videos */}
                {selectedCompany.videos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Company Videos</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCompany.videos.map((video, index) => (
                        <video key={index} controls className="w-full rounded-lg">
                          <source src={video.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

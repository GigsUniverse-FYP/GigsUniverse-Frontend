"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Eye,
  Download,
  Building2,
  FileText,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Hash,
  Users,
  Briefcase,
} from "lucide-react"
import { toast } from "react-toastify"

type Company = {
  companyId: number
  companyName: string
  businessRegistrationNumber: string
  registrationCountry: string
  registrationDate: string
  industryType: string
  companySize: string
  companyDescription: string
  registeredCompanyAddress: string
  businessPhoneNumber: string
  businessEmail: string
  officialWebsiteUrl: string
  taxNumber: string
  companyStatus: string
  creatorId: string
  approvedBy: string | null
  creatorName: string
  approvedByName: string | null
  companyLogo?: { fileName: string; fileBytes: string; contentType: string }
  companyCert?: { fileName: string; fileBytes: string; contentType: string }
  businessLicense?: { fileName: string; fileBytes: string; contentType: string }
}

export default function CompanyVerificationPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [approverFilter, setApproverFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [statusReason, setStatusReason] = useState("")
  const [updating, setUpdating] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Fetch companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${backendUrl}/api/company/admin-verification`, {
          credentials: "include",
          method: "GET",
        })
        if (!response.ok) throw new Error("Failed to fetch companies")
        const data = await response.json()
        setCompanies(data)
        console.log(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  // Filter and search companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        searchTerm === "" ||
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.businessRegistrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.creatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.approvedByName && company.approvedByName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.approvedBy && company.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || company.companyStatus === statusFilter

      const matchesApprover =
        approverFilter === "all" ||
        (approverFilter === "unassigned" && !company.approvedBy) ||
        (approverFilter === "assigned" && company.approvedBy)

      return matchesSearch && matchesStatus && matchesApprover
    })
  }, [searchTerm, statusFilter, approverFilter, companies])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "terminated":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company)
    setNewStatus(company.companyStatus)
    setStatusReason("")
  }

  const handleUpdateStatus = async () => {
    if (selectedCompany && newStatus !== selectedCompany.companyStatus) {
      try {
        setUpdating(true)
        const response = await fetch(`${backendUrl}/api/company/${selectedCompany.companyId}/status`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newStatus,
            reason: statusReason,
          }),
        })

        if (!response.ok) throw new Error("Failed to update status")

        // Update local state
        const updatedCompanies = companies.map((company) =>
          company.companyId === selectedCompany.companyId
            ? {
                ...company,
                companyStatus: newStatus,
                approvedBy: "current-user-id",
                approvedByName: "Current User",
              }
            : company,
        )
        console.log(response)
        setCompanies(updatedCompanies)
        setSelectedCompany(null)
        toast.success("Company status updated successfully")
      } catch (err) {
        
        toast.error("Failed to update company status")
      }finally{
        setUpdating(false);
      }
    }
  }

  const downloadFile = (fileName: string, fileBytes: string, contentType: string) => {
    const link = document.createElement("a")
    link.href = fileBytes
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderFilePreview = (file: { fileName: string; fileBytes: string; contentType: string }) => {
    if (file.contentType.startsWith("image/")) {
      return (
        <div className="mt-2">
          <img
            src={file.fileBytes || "/public/images/placeholder.jpg"}
            alt={file.fileName}
            className="max-w-full h-48 object-contain rounded border bg-gray-50"
          />
        </div>
      )
    } else if (file.contentType === "application/pdf") {
      return (
        <div className="mt-2">
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <iframe src={file.fileBytes} className="w-full h-64" title={`PDF Preview: ${file.fileName}`} />
          </div>
          <p className="text-xs text-gray-500 mt-1">PDF preview - Use download button for full document access</p>
        </div>
      )
    } else if (
      file.contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.contentType === "application/msword" ||
      file.fileName.toLowerCase().endsWith(".docx") ||
      file.fileName.toLowerCase().endsWith(".doc")
    ) {
      return (
        <div className="mt-2">
          <div className="p-6 bg-blue-50 rounded border border-blue-200 text-center">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800 mb-1">Word Document</p>
            <p className="text-xs text-blue-600">{file.fileName}</p>
            <p className="text-xs text-gray-600 mt-2">Click download to view the document content</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="mt-2">
          <div className="p-4 bg-gray-50 rounded border border-gray-200 text-center">
            <FileText className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{file.contentType || "Unknown file type"}</p>
            <p className="text-xs text-gray-500 mt-1">Preview not available - Click download to access file</p>
          </div>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading companies...</h3>
            <p className="text-gray-600">Please wait while we fetch the data.</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Verification</h1>
          <p className="text-gray-600">Manage and verify company registrations</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by company name, registration number, creator, or approver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={approverFilter} onValueChange={setApproverFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by approver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="assigned">Approved By Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="grid gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.companyId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">{company.companyName}</h3>
                    <Badge className={getStatusColor(company.companyStatus)}>
                      {company.companyStatus.charAt(0).toUpperCase() + company.companyStatus.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Reg #:</span>
                      <span className="font-medium">{company.businessRegistrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{company.industryType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{company.companySize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium">{company.registrationCountry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Registered:</span>
                      <span className="font-medium">{new Date(company.registrationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Creator:</span>
                      <span className="font-medium">{company.creatorName}</span>
                    </div>
                  </div>

                  {company.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                    <Award className={`h-4 w-4 ${company.companyStatus === "terminated" ? "text-red-600" : "text-green-600"}`} />
                    <span className="text-gray-600">
                      {company.companyStatus === "terminated" ? "Terminated by:" : "Approved by:"}
                    </span>
                    <span
                      className={`font-medium text-black`}
                    >
                      {company.approvedByName}
                    </span>
                    </div>
                  )}
                </div>

                <Button onClick={() => handleViewCompany(company)} className="ml-4">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Company Details Dialog */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {selectedCompany.companyName} - Verification Details
              </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Company Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Company Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Name</label>
                      <p className="text-gray-900">{selectedCompany.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Number</label>
                      <p className="text-gray-900">{selectedCompany.businessRegistrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Industry Type</label>
                      <p className="text-gray-900">{selectedCompany.industryType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Size</label>
                      <p className="text-gray-900">{selectedCompany.companySize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Country</label>
                      <p className="text-gray-900">{selectedCompany.registrationCountry}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Email</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {selectedCompany.businessEmail}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {selectedCompany.businessPhoneNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Website</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {selectedCompany.officialWebsiteUrl}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tax Number</label>
                      <p className="text-gray-900">{selectedCompany.taxNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Date</label>
                      <p className="text-gray-900">{new Date(selectedCompany.registrationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Company Address</label>
                  <p className="text-gray-900">{selectedCompany.registeredCompanyAddress}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Company Description</label>
                  <p className="text-gray-900">{selectedCompany.companyDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created By</label>
                    <p className="text-gray-900">
                      {selectedCompany.creatorName} ({selectedCompany.creatorId})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Approved By</label>
                    <p className="text-gray-900">{selectedCompany.approvedByName || "Not assigned"}</p>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              {(selectedCompany.companyLogo || selectedCompany.companyCert || selectedCompany.businessLicense) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Company Documents</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Company Logo */}
                    {selectedCompany.companyLogo && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Company Logo</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadFile(
                                selectedCompany.companyLogo!.fileName,
                                selectedCompany.companyLogo!.fileBytes,
                                selectedCompany.companyLogo!.contentType,
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{selectedCompany.companyLogo.fileName}</p>
                        {renderFilePreview(selectedCompany.companyLogo)}
                      </div>
                    )}

                    {/* Company Certificate */}
                    {selectedCompany.companyCert && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Incorporation Certificate</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadFile(
                                selectedCompany.companyCert!.fileName,
                                selectedCompany.companyCert!.fileBytes,
                                selectedCompany.companyCert!.contentType,
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{selectedCompany.companyCert.fileName}</p>
                        {renderFilePreview(selectedCompany.companyCert)}
                      </div>
                    )}

                    {/* Business License */}
                    {selectedCompany.businessLicense && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Business License</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadFile(
                                selectedCompany.businessLicense!.fileName,
                                selectedCompany.businessLicense!.fileBytes,
                                selectedCompany.businessLicense!.contentType,
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{selectedCompany.businessLicense.fileName}</p>
                        {renderFilePreview(selectedCompany.businessLicense)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Verification Actions</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Update Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Current Status</label>
                    <Badge className={getStatusColor(selectedCompany.companyStatus)}>
                      {selectedCompany.companyStatus}
                    </Badge>
                  </div>
                </div>

                {newStatus === "terminated" && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Termination Reason <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Enter reason for termination..."
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={
                      updating ||
                      newStatus === selectedCompany.companyStatus ||
                      (newStatus === "terminated" && !statusReason.trim())
                    }
                    className="flex-1"
                  >
                    {updating ? "Updating..." : "Update Company Status"}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedCompany(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

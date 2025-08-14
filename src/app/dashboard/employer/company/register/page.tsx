"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Info, CheckCircle, Clock, XCircle, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock registered companies data
const registeredCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    registrationNumber: "SSM-202301234567",
    industry: "Technology",
    registeredDate: "2024-01-15",
    status: "verified",
  },
  {
    id: 2,
    name: "Design Studio Pro",
    registrationNumber: "UK-87654321",
    industry: "Design",
    registeredDate: "2024-02-20",
    status: "pending",
  },
  {
    id: 3,
    name: "Marketing Hub",
    registrationNumber: "EIN-12-3456789",
    industry: "Marketing",
    registeredDate: "2024-01-10",
    status: "terminated",
  },
]

export default function RegisterCompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/employer/company">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Company Management
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Company</h1>
          <p className="text-gray-600">Register your company and track verification status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Registration Form */}
          <div className="space-y-6">
            <Card className="border border-gray-200 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Register New Company</CardTitle>
                <p className="text-gray-600">Complete all required information for company verification</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Official Registration & Legal Documents section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Official Registration & Legal Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-sm font-semibold text-gray-700">
                        Company Name *
                      </Label>
                      <Input
                        id="company-name"
                        placeholder="Enter registered company name"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration-number" className="text-sm font-semibold text-gray-700">
                        Business Registration Number *
                      </Label>
                      <Input
                        id="registration-number"
                        placeholder="e.g., SSM-202301234567, UK-12345678, EIN-87-1234567"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration-country" className="text-sm font-semibold text-gray-700">
                        Registration Country *
                      </Label>
                      <Input
                        id="registration-country"
                        placeholder="e.g., Malaysia, United Kingdom, United States"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incorporation-date" className="text-sm font-semibold text-gray-700">
                        Date of Incorporation *
                      </Label>
                      <Input id="incorporation-date" type="date" className="border-gray-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incorporation-certificate" className="text-sm font-semibold text-gray-700">
                        Certificate of Incorporation *
                      </Label>
                      <Input
                        id="incorporation-certificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-license" className="text-sm font-semibold text-gray-700">
                        Business License (if required)
                      </Label>
                      <Input
                        id="business-license"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-semibold text-gray-700">
                        Industry *
                      </Label>
                      <Input
                        id="industry"
                        placeholder="e.g., Technology, Design, Finance"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-size" className="text-sm font-semibold text-gray-700">
                        Company Size *
                      </Label>
                      <Input
                        id="company-size"
                        placeholder="e.g., 1-10, 11-50, 51-100"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Company Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your company, mission, and what makes it unique..."
                      rows={4}
                      className="border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Identity & Address Verification section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Identity & Address Verification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="registered-address" className="text-sm font-semibold text-gray-700">
                        Registered Office Address *
                      </Label>
                      <Textarea
                        id="registered-address"
                        placeholder="Enter complete registered address (must match government records)"
                        rows={3}
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="operating-address" className="text-sm font-semibold text-gray-700">
                        Operating Address
                      </Label>
                      <Textarea
                        id="operating-address"
                        placeholder="Enter operating address (if different from registered)"
                        rows={3}
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone" className="text-sm font-semibold text-gray-700">
                        Business Phone Number *
                      </Label>
                      <Input id="business-phone" placeholder="+60 12-345-6789" className="border-gray-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-email" className="text-sm font-semibold text-gray-700">
                        Business Email *
                      </Label>
                      <Input
                        id="business-email"
                        type="email"
                        placeholder="contact@yourcompany.com (business domain required)"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-semibold text-gray-700">
                        Official Website
                      </Label>
                      <Input
                        id="website"
                        placeholder="https://yourcompany.com"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-id" className="text-sm font-semibold text-gray-700">
                        Tax Identification Number
                      </Label>
                      <Input
                        id="tax-id"
                        placeholder="Company tax ID or VAT number"
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Government Registry Verification section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Government Registry Verification
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Verification Process</p>
                        <p>Your company details will be verified against official government registries:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Malaysia: SSM e-Info</li>
                          <li>UK: Companies House</li>
                          <li>Singapore: ACRA BizFile+</li>
                          <li>US: State business registries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-lg px-8">
                    Submit for Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Company Registration Status */}
          <div className="space-y-6">
            <Card className="border border-gray-200 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Registration Status</CardTitle>
                <p className="text-gray-600">Track your registered companies and their verification status</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registeredCompanies.map((company) => (
                    <div key={company.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-600">Registration: {company.registrationNumber}</p>
                          <p className="text-sm text-gray-600">Industry: {company.industry}</p>
                          <p className="text-sm text-gray-600">Registered: {company.registeredDate}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {company.status === "verified" && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {company.status === "pending" && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {company.status === "terminated" && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Terminated
                            </Badge>
                          )}
                          <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, CheckCircle, Clock, XCircle, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

interface RegisteredCompany {
  companyId: number;
  companyName: string;
  businessRegistrationNumber: string;
  registrationDate: string;
  companyStatus: string;
  creatorId: string;
  industryType: string;
}

const initialFormData = {
  companyName: "",
  registrationNumber: "",
  registrationCountry: "",
  incorporationDate: "",
  industry: "",
  companySize: "",
  description: "",
  registeredAddress: "",
  businessPhone: "",
  businessEmail: "",
  companyUrl: "",
  companyTaxNumber: "",
};


export default function RegisterCompanyPage() {

  const [formData, setFormData] = useState(initialFormData);


  const [registeredCompanies, setRegisteredCompanies] = useState<RegisteredCompany[]>([])
 
  const [files, setFiles] = useState({
    incorporationCertificate: null as File | null,
    businessLicense: null as File | null,
    companyLogo: null as File | null,
  })
  const [isVerifiedAlready, setIsVerifiedAlready] = useState(false)
  const [verifiedCount, setVerifiedCount] = useState(0)
  const [fileSizeError, setFileSizeError] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [isInvolved, setIsInvolved] = useState(false)

  const checkUserInvolvement = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/company/is-involved`, {
        method: "GET",
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error("Failed to check involvement");
      }

      const data = await response.json();
      console.log("Is involved:", data.involved);

      return data.involved as boolean;
    } catch (error) {
      console.error("Error checking company involvement:", error);
      return false;
    }
  };

  useEffect(() => {
    const verifyInvolvement = async () => {
      const involved = await checkUserInvolvement();
      setIsInvolved(involved);
    };
    verifyInvolvement();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/company/my-registered-company`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch company data")

        const raw = await res.json()
        const data: RegisteredCompany[] = raw ?? [] 
        setRegisteredCompanies(data)

        // Calculate
        const verifiedCompanies = data.filter(c => c.companyStatus === "verified")
        setVerifiedCount(verifiedCompanies.length)
        setIsVerifiedAlready(verifiedCompanies.length > 0)
        
      } catch (err) {
        console.error(err)
      }
    }

    fetchCompany()
  }, [])

  const pendingCount = registeredCompanies.filter(c => c.companyStatus === "pending").length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataObj = new FormData()
    // Add text fields
    formDataObj.append("companyName", formData.companyName)
    formDataObj.append("businessRegistrationNumber", formData.registrationNumber)
    formDataObj.append("registrationCountry", formData.registrationCountry)
    formDataObj.append("registrationDate", formData.incorporationDate)
    formDataObj.append("industryType", formData.industry)
    formDataObj.append("companySize", formData.companySize)
    formDataObj.append("companyDescription", formData.description)
    formDataObj.append("registeredCompanyAddress", formData.registeredAddress)
    formDataObj.append("businessPhoneNumber", formData.businessPhone)
    formDataObj.append("businessEmail", formData.businessEmail)
    formDataObj.append("officialWebsiteUrl", formData.companyUrl || "")
    formDataObj.append("taxNumber", formData.companyTaxNumber || "")

    // Add files (if selected)
    if (files.incorporationCertificate)
      formDataObj.append("incorporationCertificate", files.incorporationCertificate)
    if (files.businessLicense)
      formDataObj.append("businessLicense", files.businessLicense)
    if (files.companyLogo)
      formDataObj.append("companyLogo", files.companyLogo)

    try {
      const res = await fetch(`${backendUrl}/api/company`, {
        method: "POST",
        body: formDataObj,
        credentials: "include",
      })

      if (!res.ok) {
        toast.error("Failed to register company. Please try again.")
        const error = await res.text()
        throw new Error(error || "Failed to register company")
      }

      toast.success("Company submitted successfully for verification!")
      setFormData(initialFormData);
      setFiles({
        incorporationCertificate: null,
        businessLicense: null,
        companyLogo: null,
      });

      window.location.reload();

    } catch (err: any) {
      toast.error(err.message)
    }
  }



  const validateFileSize = (newFiles: typeof files) => {
    const maxSizeBytes = 12 * 1024 * 1024 // 12MB in bytes
    let totalSize = 0

    if (newFiles.incorporationCertificate) totalSize += newFiles.incorporationCertificate.size
    if (newFiles.businessLicense) totalSize += newFiles.businessLicense.size
    if (newFiles.companyLogo) totalSize += newFiles.companyLogo.size

    if (totalSize > maxSizeBytes) {
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2)
      setFileSizeError(`Total file size (${totalSizeMB}MB) exceeds the 12MB limit. Please reduce file sizes.`)
      return false
    } else {
      setFileSizeError("")
      return true
    }
  }

  const validateForm = () => {
    const requiredFields = [
      formData.companyName,
      formData.registrationNumber,
      formData.registrationCountry,
      formData.incorporationDate,
      formData.industry,
      formData.companySize,
      formData.description,
      formData.registeredAddress,
      formData.businessPhone,
      formData.businessEmail,
      files.incorporationCertificate,
    ]

    const allRequiredFieldsFilled = requiredFields.every((field) => field && field.toString().trim() !== "")
    const noFileSizeError = !fileSizeError

    setIsFormValid(allRequiredFieldsFilled && noFileSizeError)
  }

  useEffect(() => {
    validateForm()
  }, [formData, files, fileSizeError])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (fileType: keyof typeof files, file: File | null) => {
    const newFiles = { ...files, [fileType]: file }
    setFiles(newFiles)
    validateFileSize(newFiles)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 -ml-20 sm:ml-0">
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
                {fileSizeError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{fileSizeError}</AlertDescription>
                  </Alert>
                )}

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
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
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
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
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
                        value={formData.registrationCountry}
                        onChange={(e) => handleInputChange("registrationCountry", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incorporation-date" className="text-sm font-semibold text-gray-700">
                        Date of Incorporation *
                      </Label>
                      <Input
                        id="incorporation-date"
                        type="date"
                        className="border-gray-300 rounded-lg"
                        value={formData.incorporationDate}
                        onChange={(e) => handleInputChange("incorporationDate", e.target.value)}
                      />
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
                        onChange={(e) => handleFileChange("incorporationCertificate", e.target.files?.[0] || null)}
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
                        onChange={(e) => handleFileChange("businessLicense", e.target.files?.[0] || null)}
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
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
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
                        value={formData.companySize}
                        onChange={(e) => handleInputChange("companySize", e.target.value)}
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
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
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
                        value={formData.registeredAddress}
                        onChange={(e) => handleInputChange("registeredAddress", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-logo" className="text-sm font-semibold text-gray-700">
                        Official Company Logo
                      </Label>
                      <Input
                        id="company-logo"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="border-gray-300 rounded-lg"
                        onChange={(e) => handleFileChange("companyLogo", e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone" className="text-sm font-semibold text-gray-700">
                        Business Phone Number *
                      </Label>
                      <Input
                        id="business-phone"
                        placeholder="+60 12-345-6789"
                        className="border-gray-300 rounded-lg"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                      />
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
                        value={formData.businessEmail}
                        onChange={(e) => handleInputChange("businessEmail", e.target.value)}
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
                        value={formData.companyUrl}
                        onChange={(e) => handleInputChange("companyUrl", e.target.value)}
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
                        value={formData.companyTaxNumber}
                        onChange={(e) => handleInputChange("companyTaxNumber", e.target.value)}
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
                  {verifiedCount > 0 ? (
                    <p className="text-red-600 text-xs">
                      One user can only create one company
                    </p>
                  ) : pendingCount > 0 ? (
                    <p className="text-yellow-600 text-xs">
                      Your company status is pending. Please be patient while it’s being verified.
                    </p>
                  ) : isInvolved ? (
                    <p className="text-red-600 text-xs">
                      You are already involved in a company and cannot create another.
                    </p>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-black hover:bg-gray-800 text-white rounded-lg px-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!isFormValid}
                    >
                      Submit for Verification
                    </Button>
                  )}
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
                    <div key={company.companyId} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{company.companyName}</h3>
                          <p className="text-sm text-gray-600">Registration: {company.businessRegistrationNumber}</p>
                          <p className="text-sm text-gray-600">Industry: {company.industryType}</p>
                          <p className="text-sm text-gray-600">Registered: {new Date(company.registrationDate).toISOString().split("T")[0]}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {company.companyStatus === "verified" && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {company.companyStatus === "pending" && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {company.companyStatus === "terminated" && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Terminated
                            </Badge>
                          )}
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

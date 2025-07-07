"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CheckCircle,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Shield,
  Briefcase,
  DollarSign,
  ScrollText,
  ExternalLink,
} from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Personal Identity Verification",
    description: "Verify your identity using Sumsub",
    icon: Shield,
    color: "black",
  },
  {
    id: 2,
    title: "Create Professional Account",
    description: "Setup your professional freelancer profile",
    icon: Briefcase,
    color: "black",
  },
  {
    id: 3,
    title: "Agree to Terms and Conditions",
    description: "Review and accept our terms of service",
    icon: ScrollText,
    color: "black",
  },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    // Identity Verification (Sumsub)
    sumsubVerified: false,

    // Professional Account
    title: "",
    bio: "",
    skills: "",
    hourlyRate: "",
    portfolio: "",
    experience: "",

    // Terms
    termsAccepted: false,
    privacyAccepted: false,
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1:
        return formData.sumsubVerified
      case 2:
        return formData.title && formData.bio && formData.skills && formData.hourlyRate
      case 3:
        return formData.termsAccepted && formData.privacyAccepted
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
              <p className="text-gray-600">Complete identity verification using Sumsub to build trust with clients</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sumsub Identity Verification</h3>
              <p className="text-gray-600 mb-6">
                We use Sumsub, a trusted identity verification service, to ensure the security and authenticity of all
                freelancers on our platform.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Government ID verification</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Facial recognition check</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Address verification</span>
                  </div>
                </div>
              </div>

              {!formData.sumsubVerified ? (
                <Button
                  className="w-full bg-black hover:black"
                  onClick={() => {
                    // This would integrate with Sumsub SDK
                    alert("Sumsub verification would be integrated here")
                    handleInputChange("sumsubVerified", true)
                  }}
                >
                  Start Verification with Sumsub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Identity Verified Successfully</span>
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Professional Account</h2>
              <p className="text-gray-600">Setup your professional profile to attract clients</p>
            </div>

            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Full Stack Developer, Graphic Designer, Content Writer"
              />
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell clients about your experience, expertise, and what makes you unique..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="React, Node.js, Python, UI/UX Design, Content Writing"
              />
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="e.g., 5 years"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio URL (optional)</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange("portfolio", e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms and Conditions</h2>
              <p className="text-gray-600">Please review and accept our terms to complete your registration</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Terms of Service</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>By using GigsUniverse, you agree to the following terms:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You will provide accurate and truthful personal, company, and job posting information</li>
                    <li>You will treat freelancers with respect and maintain professional communication</li>
                    <li>You will honor agreed-upon payment terms and release payments promptly upon work completion</li>
                    <li>You will not request free work, underpay, or exploit freelancers</li>
                    <li>You will respect the intellectual property rights of freelancers and any confidentiality agreements</li>
                    <li>You will comply with all applicable laws and regulations relevant to hiring and payments</li>
                    <li>You understand that GigsUniverse charges a service fee on payments processed through the platform</li>
                    <li>You will not engage in fraudulent activities, fake job postings, or misrepresentation</li>
                  </ul>
                  <p className="mt-4">
                    GigsUniverse reserves the right to suspend or terminate accounts that violate these terms. We are
                    committed to maintaining a safe and professional environment for all users.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and understand my obligations as a freelancer on this platform.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => handleInputChange("privacyAccepted", checked as boolean)}
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700 leading-5">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and consent to the processing of my personal data for platform operations.
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GigsUniverse</h1>
          <p className="text-gray-600">Complete your profile setup to start finding amazing opportunities</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200 mb-3 ${
                    completedSteps.includes(step.id)
                      ? "bg-green-500 border-green-500 text-white shadow-lg"
                      : step.id === currentStep
                        ? "border-blue-500 text-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 text-gray-400 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : (
                    <span className="font-bold text-lg">{step.id}</span>
                  )}
                </button>
                <div className="text-center max-w-32">
                  <span
                    className={`text-sm font-medium ${step.id === currentStep ? "text-blue-600" : "text-gray-600"}`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!isStepComplete(currentStep)}
                className="flex items-center gap-2 bg-black hover:black"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                disabled={!isStepComplete(currentStep)}
                className="flex items-center gap-2 bg-black hover:black"
              >
                Complete Setup
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

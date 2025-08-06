"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, ScrollText, ArrowLeft } from "lucide-react"
import StepIndicator from "../step-indicator"
import useOnboardingRedirect from "../../lib/useOnboardingRule"

export default function Step4TermsConditions() {
  const router = useRouter()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  useOnboardingRedirect()

  const completeOnboarding = async () => {
    setIsSubmitting(true)
    try {
        const res = await fetch(`${backendUrl}/api/onboarding/freelancer/onboarded`, {
          method: "POST",
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch user info")

        alert("Onboarding completed successfully! Welcome to GigsUniverse!")

        router.push("/dashboard/freelancer") 

    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      alert("Failed to complete onboarding. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = termsAccepted && privacyAccepted

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GigsUniverse</h1>
          <p className="text-gray-600">Complete your profile setup to start finding amazing opportunities</p>
        </div>

        <StepIndicator currentStep={4} completedSteps={completedSteps} />

        <Card className="mb-8">
          <CardContent className="p-8">
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
                      <li>You will provide accurate and truthful information in your profile</li>
                      <li>You will maintain professional conduct with all clients and platform users</li>
                      <li>You will deliver work as agreed upon in contracts and meet deadlines</li>
                      <li>You will respect intellectual property rights and confidentiality agreements</li>
                      <li>You will comply with all applicable laws and regulations in your jurisdiction</li>
                      <li>You understand that GigsUniverse charges a service fee on completed transactions</li>
                      <li>You will not engage in fraudulent activities or misrepresent your capabilities</li>
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
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                      I agree to the{" "}
                      <a href="/term" target="_blank" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and understand my obligations as a freelancer on this platform.
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={privacyAccepted}
                      onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700 leading-5">
                      I agree to the{" "}
                      <a href="/privacy" rel="noopener noreferrer" target="_blank" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and consent to the processing of my personal data for platform operations.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-end items-center mt-6">
          <Button
            onClick={completeOnboarding}
            disabled={!isFormValid || isSubmitting}
            className="flex items-center gap-2 bg-black hover:bg-gray-800"
          >
            {isSubmitting ? "Completing..." : "Complete Setup"}
            <CheckCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

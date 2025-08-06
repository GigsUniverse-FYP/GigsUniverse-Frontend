"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingEntry() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await fetch(`${backendURL}/api/onboarding/employer/status`, {
          credentials: "include", 
        })

        if (!res.ok) {
          console.error("Failed to fetch onboarding status")
          return
        }

        const data = await res.json()
        const {
          completedProfile,
          completedIdentity,
          completedOnboarding,
        } = data

        if (completedOnboarding) {
          router.push("/dashboard/employer")
        } else if (completedProfile) {
          router.push("/dashboard/employer/onboarding/step-3")
        } else if (completedIdentity) {
          router.push("/dashboard/employer/onboarding/step-2")
        } else {
          router.push("/dashboard/employer/onboarding/step-1")
        }
      } catch (error) {
        console.error("Onboarding check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkOnboarding()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your onboarding progress...</p>
      </div>
    </div>
  )
}

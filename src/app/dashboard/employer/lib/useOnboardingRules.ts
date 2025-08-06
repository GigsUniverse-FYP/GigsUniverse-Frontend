"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const useOnboardingRedirect = () => {
  const router = useRouter()
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
      }
    }

    checkOnboarding()
  }, [router])
}

export default useOnboardingRedirect

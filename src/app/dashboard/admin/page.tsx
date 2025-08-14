'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function AdminDashboard() {

  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
      const checkOnboardingStatus = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/onboarding/admin/profile`, {
            credentials: "include",
          })
  
          if (!res.ok) throw new Error("Failed to check onboarding status")
  
          const data = await res.json()
          if (!data.profileCompleted) {
            router.push("/dashboard/admin/profile-setup")
          }
        } catch (err) {
          console.error("Onboarding check failed:", err)
        }
      }
      checkOnboardingStatus()
    }, [router])
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard!</p>
    </div>
  );
}
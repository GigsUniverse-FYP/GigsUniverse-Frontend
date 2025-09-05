'use client';

import { ContractsChart } from "@/app/components/admin_components/contracts-chart";
import { EarningsChart } from "@/app/components/admin_components/earnings-chart";
import { PayoutsChart } from "@/app/components/admin_components/payouts-chart";
import { SubscriptionEarnings } from "@/app/components/admin_components/subscription-earnings-chart";
import { UserGrowthChart } from "@/app/components/admin_components/user-growth-chart";
import { UserRolesPieChart } from "@/app/components/admin_components/user-roles-pie-chart";
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
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 font-medium">Freelancing platform analytics and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>

        <div className="lg:col-span-1">
          <UserRolesPieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EarningsChart />
        <ContractsChart />
        <PayoutsChart />
      </div>

      {/* Subscription Earnings Section */}
      <div className="grid grid-cols-1">
        <SubscriptionEarnings />
      </div>
    </div>
  )
}

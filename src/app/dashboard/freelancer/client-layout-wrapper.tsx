"use client"

import { usePathname } from "next/navigation"
import HoverSidebar from "@/app/components/freelancer_components/freelancer_navigator"

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideSidebar =
    pathname.startsWith("/dashboard/freelancer/onboarding") ||
    pathname === "/dashboard/freelancer/banned"

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <HoverSidebar />}
      <div className={`flex-1 flex flex-col ${!hideSidebar ? "ml-20" : ""}`}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}

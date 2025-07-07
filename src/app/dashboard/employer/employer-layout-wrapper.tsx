"use client"

import { usePathname } from "next/navigation"
import HoverSidebar from "@/app/components/employer_components/employer_navigator"

export default function EmployerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideSidebar =
    pathname.startsWith("/dashboard/employer/onboarding") ||
    pathname === "/dashboard/employer/banned"

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <HoverSidebar />}
      <div className={`flex-1 flex flex-col ${!hideSidebar ? "ml-20" : ""}`}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}

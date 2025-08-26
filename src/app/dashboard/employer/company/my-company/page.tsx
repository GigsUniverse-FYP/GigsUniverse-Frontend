"use client"

import { useEffect, useState } from "react"
import NoCompany from "./no-company"
import CompanyWithData from "./company-with-data"

export default function CompanyManagementPage() {
  const [userInvolvement, setUserInvolvement] = useState<{ involved: boolean; companyId: number | null }>({
    involved: false,
    companyId: null,
  })

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchUserInvolvement = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/company/user-involvement`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user involvement");

        const data: { userId: string; involved: boolean; companyId: number | null } = await res.json();
        console.log("Fetched user involvement:", data); // <-- add this
        setUserInvolvement({ involved: data.involved, companyId: data.companyId });
      } catch (err) {
        console.error(err);
      } 
    };

    fetchUserInvolvement();
  }, []);

  // Determine if user has a company
  const hasCompany = userInvolvement.involved
  const acquiredCompanyId = userInvolvement.companyId

  if (!hasCompany) {
    return <NoCompany />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Company</h1>
          <p className="text-gray-600">Manage your company profile and team</p>
        </div>

        {acquiredCompanyId && <CompanyWithData companyId={acquiredCompanyId} />}
      </div>
    </div>
  )
}

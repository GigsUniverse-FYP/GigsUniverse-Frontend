"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Search, Plus } from "lucide-react"
import Link from "next/link"

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Management</h1>
          <p className="text-gray-600">Manage your company profile and explore opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* My Company Card */}
          <Card className="border border-gray-200 bg-white rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">My Company</h3>
              <p className="text-gray-600 mb-6">View and manage your company profile, employees, and settings</p>
              <Link href="/dashboard/employer/company/my-company">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-lg w-full">View My Company</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Browse Companies Card */}
          <Card className="border border-gray-200 bg-white rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse Companies</h3>
              <p className="text-gray-600 mb-6">Explore companies, view their profiles and find opportunities</p>
              <Link href="/dashboard/employer/company/browse">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg w-full bg-transparent">
                  Browse Companies
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Register Company Card */}
          <Card className="border border-gray-200 bg-white rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-8 text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Register Company</h3>
              <p className="text-gray-600 mb-6">Register your company and manage verification status</p>
              <Link href="/dashboard/employer/company/register">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg w-full bg-transparent">
                  Register Company
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

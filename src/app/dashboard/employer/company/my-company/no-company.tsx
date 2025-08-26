import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import Link from "next/link"

export default function NoCompany() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Company</h1>
          <p className="text-gray-600">Manage your company profile and team</p>
        </div>

        <Card className="border border-gray-200 bg-white rounded-xl">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Company Joined</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You haven't joined any company yet. Browse available companies or register your own to get started.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="/dashboard/employer/company/browse">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-lg px-6">Browse Companies</Button>
              </Link>
              <Link href="/dashboard/employer/company/register">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg px-6 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Company
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

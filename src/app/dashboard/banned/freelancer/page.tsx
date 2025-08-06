"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, AlertTriangle, Mail, FileText, Calendar, Info, ExternalLink, MessageCircle } from "lucide-react"

interface BannedPageProps {
  banReason?: string
  unbanDate?: string
  banType?: "temporary" | "permanent"
  banId?: string
  appealAllowed?: boolean
  contactEmail?: string
}

export default function BannedPage({
  banReason = "Violation of Terms of Service - Inappropriate conduct with clients",
  unbanDate = "January 15, 2025",
  banType = "temporary",
  banId = "BAN-2024-001234",
  appealAllowed = true,
  contactEmail = "admin@gigsuniverse.studio",
}: BannedPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysUntilUnban = () => {
    if (banType === "permanent") return null
    const unban = new Date(unbanDate)
    const today = new Date()
    const diffTime = unban.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = getDaysUntilUnban()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Main Ban Notice */}
        <Card className="border-2 border-black bg-white rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-gray-900 mb-2">Account Suspended</CardTitle>
            <p className="text-gray-600 font-medium">
              Your GigsUniverse account has been {banType === "permanent" ? "permanently" : "temporarily"} suspended
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Ban Status */}
            <div className="flex items-center justify-center gap-4">
              <Badge
                className={`${
                  banType === "permanent" ? "bg-black text-white" : "bg-black text-white"
                } font-black text-sm px-4 py-2 rounded-2xl`}
              >
                {banType === "permanent" ? "Permanent Ban" : "Temporary Suspension"}
              </Badge>
              {banType === "temporary" && daysRemaining !== null && (
                <Badge className="bg-gray-200 text-gray-700 font-black text-sm px-4 py-2 rounded-2xl">
                  {daysRemaining} days remaining
                </Badge>
              )}
            </div>

            <Separator />

            {/* Ban Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-200">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 mb-2">Reason for Suspension</h3>
                  <p className="text-gray-700 font-medium">{banReason}</p>
                </div>
              </div>

              {banType === "temporary" && (
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 mb-2">Account Restoration Date</h3>
                    <p className="text-gray-700 font-medium">
                      Your account will be automatically restored on{" "}
                      <span className="font-black text-blue-600">{formatDate(unbanDate)}</span>
                    </p>
                    {daysRemaining !== null && daysRemaining > 0 && (
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        ({daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining)
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <Info className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 mb-2">Ban Reference ID</h3>
                  <p className="text-gray-700 font-mono text-sm bg-white px-3 py-2 rounded-lg border">{banId}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please reference this ID in any correspondence regarding your suspension
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appeal Process */}
        {appealAllowed && (
          <Card className="border-2 border-gray-200 bg-white rounded-3xl shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black rounded-2xl">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-black text-gray-900">Appeal Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 font-medium">
                If you believe this suspension was issued in error, you may submit an appeal for review by our
                moderation team.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  asChild
                  className="h-14 bg-black text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <a
                    href={`mailto:${contactEmail}?subject=Ban Appeal - ${banId}`}
                    className="flex items-center justify-center gap-3"
                  >
                    <Mail className="w-5 h-5" />
                    Submit Appeal
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-14 border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-2xl font-black transition-all duration-300 hover:scale-105"
                >
                  <a href="/terms" className="flex items-center justify-center gap-3">
                    <FileText className="w-5 h-5" />
                    Review Terms
                  </a>
                </Button>
              </div>

              <div className="bg-white p-4 rounded-2xl border">
                <h4 className="font-black text-gray-900 mb-2">Appeal Guidelines</h4>
                <ul className="text-sm text-gray-700 space-y-1 font-medium">
                  <li>• Appeals are reviewed within 3-5 business days</li>
                  <li>• Provide detailed explanation and any supporting evidence</li>
                  <li>• Include your Ban Reference ID in all communications</li>
                  <li>• Only one appeal per suspension is allowed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card className="border-2 border-gray-200 bg-white rounded-3xl shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-2xl">
                <Info className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle className="text-2xl font-black text-gray-900">Important Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-gray-900 mb-3">During Suspension</h4>
                <ul className="text-sm text-gray-600 space-y-2 font-medium">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Cannot access freelancer dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Cannot apply for new jobs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Cannot communicate with clients
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Profile hidden from search results
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-gray-900 mb-3">Need Help?</h4>
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10"
                  >
                    <a href="/help" className="flex items-center gap-3">
                      <ExternalLink className="w-4 h-4" />
                      Help Center
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10"
                  >
                    <a href="/community-guidelines" className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      Community Guidelines
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-10"
                  >
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      Contact Support
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 font-medium">
          <p>© 2025 GigsUniverse. All rights reserved.</p>
          <p className="mt-1">
            Questions? Contact us at{" "}
            <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline font-bold">
              {contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

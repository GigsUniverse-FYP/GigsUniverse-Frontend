"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, ArrowLeft, RefreshCw, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailFail() {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")
  const [cooldown, setCooldown] = useState(0) 

  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email") || "Closed Access"

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendError("")
    setResendSuccess(false)

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      const response = await fetch(`${backendURL}/api/auth/freelancer/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.status === 429) {
        setResendError("Please wait 60 seconds before resending.")
        return
      }

      if (!response.ok) throw new Error("Failed to resend email")

      setResendSuccess(true)
      setCooldown(60)

    } catch (error) {
      setResendError("Failed to resend confirmation email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="/icons/landing-icon.png" className="w-18 h-18 text-white" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/register">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-gray-300 bg-white shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 border-2 border-red-300">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Verification Failed</CardTitle>
              <CardDescription className="text-gray-600">We couldn't verify your email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resendSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    New verification email sent successfully! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {resendError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{resendError}</AlertDescription>
                </Alert>
              )}

              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start space-x-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Verification Error</p>
                  </div>
                </div>
              </div>

              {email && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-700 mb-2">Account email:</p>
                  <p className="font-medium text-gray-900">{email}</p>
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-3">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">What you can do:</p>
                  <ul className="space-y-1 ml-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Request a new verification email</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Check your email for the latest link</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Contact support if issues persist</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                  disabled={isResending}
                >
                {isResending ? (
                <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                </>
                ) : cooldown > 0 ? (
                `Try again in ${cooldown}s`
                ) : (
                <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Confirmation Email
                </>
                )}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Still having trouble?{" "}
                <Link href="/#contact" className="text-gray-900 hover:text-black font-medium">
                  Contact Support
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

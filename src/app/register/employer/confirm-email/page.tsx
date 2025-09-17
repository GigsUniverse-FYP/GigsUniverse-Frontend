"use client"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic";

export default function ConfirmEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token")
  const email = searchParams.get("email") || "Closed Access"

  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")
  const [cooldown, setCooldown] = useState(0) 

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!token) return

    const verifyToken = async () => {
      try {
        const res = await fetch(`${backendURL}/api/auth/employer/confirm-email?token=${token}`)
        if (!res.ok) throw new Error("Verification failed")
        router.replace("/register/employer/email-success")
      } catch (err) {
        router.replace(`/register/employer/email-fail?email=${email}&token=${token}`)
      }
    }

    verifyToken()
  }, [token])


  const handleResendEmail = async () => {
    setIsResending(true)
    setResendError("")
    setResendSuccess(false)

    try {
      const response = await fetch(`${backendURL}/api/auth/employer/resend-confirmation`, {
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
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-gray-300 bg-white shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-2 border-blue-300">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Confirm Your Email</CardTitle>
              <CardDescription className="text-gray-600">
                We've sent a confirmation email to verify your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resendSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">Confirmation email sent successfully!</AlertDescription>
                </Alert>
              )}

              {resendError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{resendError}</AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-700 mb-2">We sent a confirmation email to:</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-3">
                <div className="space-y-2">
                  <p className="font-medium">What to do next:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Check your email inbox</li>
                    <li>Click the confirmation link in the email</li>
                    <li>Return here to sign in</li>
                  </ol>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm text-amber-800">
                    <strong>Can't find the email?</strong> Check your spam or junk folder.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full bg-gray-900 hover:bg-gray-800 hover:text-white text-white"
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
                Need help?{" "}
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

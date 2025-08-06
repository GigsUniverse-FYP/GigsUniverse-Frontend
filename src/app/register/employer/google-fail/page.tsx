"use client"
import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw, UserPlus, AlertTriangle } from "lucide-react"

export default function GoogleSignupFail() {
  const [isRetrying, setIsRetrying] = useState(false)

  const params = useSearchParams()
  const userId = params.get("id") || "unknown_user"
  const userEmail = params.get("email") || "unknown_email"
  const errorReason = params.get("reason") || "unknown_error"

  const getErrorDetails = () => {
    switch (errorReason) {
      case "email_exists":
        return {
          title: "Account Already Exists",
          message: "An account with this email already exists. Please sign in instead.",
          icon: <AlertTriangle className="w-10 h-10 text-yellow-600" />,
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
          canRetry: false,
        }
      case "id_exists":
        return {
          title: "ID Already Taken",
          message: "Please register with another ID.",
          icon: <XCircle className="w-10 h-10 text-red-600" />,
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          canRetry: true,
        }
      case "email_required":
        return {
          title: "An Email Address is Required",
          message: "Registration requires a valid email address in Gmail. Please Retry",
          icon: <XCircle className="w-10 h-10 text-red-600" />,
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          canRetry: true,
        }
      case "session_expired_or_invalid":
        return {
          title: "Invalid or Expired Session Detected",
          message: "Exceeded the time limit for Google sign up. Please try again.",
          icon: <XCircle className="w-10 h-10 text-red-600" />,
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          canRetry: true,
        }
      default:
        return {
          title: "Sign Up Failed",
          message: "Something went wrong. Please try again.",
          icon: <XCircle className="w-10 h-10 text-red-600" />,
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          canRetry: true,
        }
    }
  }

  const errorDetails = getErrorDetails()

  const handleRetryGoogle = () => {
    setIsRetrying(true)
    window.location.href = "/register/employer/google-setup"
  }

  const getActionButtons = () => {
    if (errorReason === "email_exists") {
      return (
        <div className="space-y-3">
          <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            <Link href="/login/employer">Sign In Instead</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
            <Link href="/login/employer/forgot-password">Forgot Password?</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {errorDetails.canRetry && (
          <Button
            onClick={handleRetryGoogle}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Google Sign Up Again
              </>
            )}
          </Button>
        )}
        <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
          <Link href="/register/employer">
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up with Email Instead
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="/icons/landing-icon.png" className="w-18 h-18 text-white" alt="GigsUniverse Logo" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/register">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all cursor-pointer duration-300"
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
              <div className={`mx-auto w-20 h-20 ${errorDetails.bgColor} rounded-full flex items-center justify-center mb-4 border-2 ${errorDetails.borderColor}`}>
                {errorDetails.icon}
              </div>
              <CardTitle className="text-2xl text-gray-900">{errorDetails.title}</CardTitle>
              <CardDescription className="text-gray-600">Google sign up could not be completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`${errorDetails.bgColor} border ${errorDetails.borderColor} rounded-md p-4`}>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">{errorDetails.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">What happened?</p>
                    <p className="text-sm text-gray-700">{errorDetails.message}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-700 mb-1">Employer ID:</p>
                <p className="font-medium text-gray-900">{userId}</p>
                <p className="text-sm text-gray-700 mt-3">Email address:</p>
                <p className="font-medium text-gray-900">{userEmail}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-3">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">What you can do:</p>
                  <ul className="space-y-1 ml-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>{errorReason === "email_exists" ? "Sign in with your existing account" : "Try the Google sign up again"}</span>
                    </li>
                    {errorReason === "email_exists" && (
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>Reset your password if needed</span>
                      </li>
                    )}
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Sign up with email instead</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Contact support if issues persist</span>
                    </li>
                  </ul>
                </div>
              </div>

              {getActionButtons()}

              <div className="text-center text-sm text-gray-600">
                Need help?{" "}
                <Link href="/#contact" className="text-gray-900 hover:text-black cursor-pointer font-medium">
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
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  XCircle,
  UserPlus,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"
import type { JSX } from "react/jsx-runtime"

interface ErrorDetails {
  title: string
  message: string
  icon: JSX.Element
  bgColor: string
  borderColor: string
  canRetry: boolean
}

export default function OAuthFail() {
  const [reason, setReason] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setReason(params.get("reason") || "oauth2_failed")
  }, [])

  const getErrorDetails = (): ErrorDetails => {
    switch (reason) {
      case "user_not_registered":
        return {
          title: "Account Not Found",
          message: "No account exists for this Google email. Please register first.",
          icon: <UserPlus className="w-10 h-10 text-yellow-600" />,
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
          canRetry: true,
        }
      case "not_registered_with_google":
        return {
          title: "Wrong Sign-In Method",
          message: "This email is not registered using Google. Try using email login instead.",
          icon: <AlertTriangle className="w-10 h-10 text-yellow-600" />,
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
          canRetry: true,
        }
      case "oauth2_failed":
      default:
        return {
          title: "Authentication Failed",
          message: "Something went wrong with Google authentication. Please try again.",
          icon: <XCircle className="w-10 h-10 text-red-600" />,
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          canRetry: true,
        }
    }
  }

  const errorDetails = getErrorDetails()

  const handleRetryLogin = () => {
    window.location.href = "/login/employer"
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
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-white text-black border-black cursor-pointer hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
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
              <div
                className={`mx-auto w-20 h-20 ${errorDetails.bgColor} rounded-full flex items-center justify-center mb-4 border-2 ${errorDetails.borderColor}`}
              >
                {errorDetails.icon}
              </div>
              <CardTitle className="text-2xl text-gray-900">{errorDetails.title}</CardTitle>
              <CardDescription className="text-gray-600">
                Google authentication could not be completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`${errorDetails.bgColor} border ${errorDetails.borderColor} rounded-md p-4`}>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {reason === "user_not_registered" ? (
                      <UserPlus className="w-5 h-5 text-yellow-600" />
                    ) : reason === "not_registered_with_google" ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">What happened?</p>
                    <p className="text-sm text-gray-700">{errorDetails.message}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {errorDetails.canRetry && (
                  <Button
                    onClick={handleRetryLogin}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                  >
                    Retry Login
                  </Button>
                )}

                <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent cursor-pointer">
                  <Link href="/#contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

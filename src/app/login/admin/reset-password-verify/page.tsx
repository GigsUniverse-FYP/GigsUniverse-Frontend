"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormErrors {
  code?: string
  general?: string
}

export default function PasswordResetVerify() {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const validateCode = (code: string) => {
    if (!code.trim()) {
      return "Verification code is required"
    }
    if (code.length < 8) {
      return "Verification code must be at least 8 characters"
    }
    return null
  }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const codeError = validateCode(code)
    if (codeError) {
        setErrors({ code: codeError })
        return
    }

    setIsLoading(true)
    setErrors({})

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

    try {
        const response = await fetch(`${backendURL}/api/auth/admin/verify-reset-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
        })

        const resultText = await response.text()

        if (!response.ok) {
        if (resultText === "Invalid code") {
            setErrors({ code: "Invalid verification code. Please check and try again." })
        } else if (resultText === "Verification code has expired. Please request a new one.") {
            setErrors({ code: "Verification code expired. Please resend a new one." })
        } else {
            setErrors({ general: "Failed to verify code. Please try again." })
        }
        return
        }

        router.push(`/login/admin/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);

    } catch (error) {
        setErrors({ general: "Network error. Please try again." })
    } finally {
        setIsLoading(false)
    }
    }

    const handleResendCode = async () => {
    setIsResending(true)
    setResendSuccess(false)
    setErrors({})

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

    try {
        const response = await fetch(`${backendURL}/api/auth/admin/resend-reset-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        })

        const resultText = await response.text()

        if (!response.ok) {
        if (resultText === "You must wait 60 seconds before resending.") {
            setErrors({ general: "Please wait 60 seconds before resending a new code." })
        } else if (resultText === "User not found") {
            setErrors({ general: "No account found with this email address." })
        } else {
            setErrors({ general: "Failed to resend code. Please try again." })
        }
        return
        }

        setResendSuccess(true)
    } catch (error) {
        setErrors({ general: "Network error. Please try again." })
    } finally {
        setIsResending(false)
    }
    }

  const handleCodeChange = (value: string) => {
    // Only allow alphanumeric characters and limit length
    const cleanValue = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 8)
    setCode(cleanValue)
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: undefined }))
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
            <Link href="/forgot-password">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-gray-300 bg-white shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-2 border-blue-300">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Enter Verification Code</CardTitle>
              <CardDescription className="text-gray-600">
                We sent a verification code to your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resendSuccess && (
                <Alert className="border-green-200 bg-green-50 mb-4">
                  <AlertDescription className="text-green-700">
                    New verification code sent successfully!
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
                  </Alert>
                )}

                {email && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-sm text-gray-700">Code sent to:</p>
                    <p className="font-medium text-gray-900">{email}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-gray-700">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 8 character code"
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={`border-gray-300 focus:border-gray-500 text-center text-lg font-mono tracking-wider ${errors.code ? "border-red-500" : ""}`}
                    maxLength={8}
                  />
                  {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                  <p className="text-xs text-gray-500">
                    Check your email for the verification code. It may take a few minutes to arrive.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>

              <div className="mt-4 space-y-3">
                <div className="text-center">
                  <Button
                    onClick={handleResendCode}
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Didn't receive the code? Check your spam folder or{" "}
                  <Link href="/support" className="text-gray-900 hover:text-black font-medium">
                    contact support
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

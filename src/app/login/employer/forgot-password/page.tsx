"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormErrors {
  email?: string
  general?: string
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }

    setIsLoading(true)
    setErrors({})

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      // Step 1: Check if email exists
      const checkRes = await fetch(
        `${backendURL}/api/auth/employer/check-email?email=${encodeURIComponent(email)}`
      )

      if (!checkRes.ok) {
        setErrors({ email: "No account found with this email address." })
        return
      }

      // Step 2: Check if email is registered with correct provider
      const checkProvider = await fetch(
        `${backendURL}/api/auth/employer/check-provider?email=${encodeURIComponent(email)}`
      )

      if (checkProvider.status === 404) {
        setErrors({ email: "No account found with this email address." })
        return;
      }else if (checkProvider.status === 403) {
        const text = await checkProvider.text();
        setErrors({ email: text || "Account registered with Google. Use Google login." });
        return;
      }else if (!checkProvider.ok) {
        const text = await checkProvider.text();
        setErrors({ general: text || "Unexpected error during provider check." });
        return;
      }



      // Step 3: Request reset code
      const forgotRes = await fetch(`${backendURL}/api/auth/employer/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!forgotRes.ok) {
        const resultText = await forgotRes.text()
        setErrors({
          general: resultText || "Failed to send reset email. Please try again.",
        })
        return
      }

      setIsEmailSent(true)

      router.push(`/login/employer/reset-password-verify?email=${encodeURIComponent(email)}`)

    } catch (error) {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
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
            <Link href="/login/employer">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-gray-300 bg-white shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-300">
                <Mail className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Forgot Password?</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="employer@gmail.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`border-gray-300 focus:border-gray-500 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/login/employer" className="text-gray-900 hover:text-black font-medium">
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

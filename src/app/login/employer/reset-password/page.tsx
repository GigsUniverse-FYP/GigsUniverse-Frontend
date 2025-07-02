"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

interface FormErrors {
  password?: string
  confirmPassword?: string
  general?: string
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Get email and code from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get("email")
    const codeParam = urlParams.get("code")

    if (emailParam) setEmail(emailParam)
    if (codeParam) setCode(codeParam)

    // If missing params, redirect back
    if (!emailParam || !codeParam) {
      window.location.href = "/forgot-password"
    }
  }, [])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      const response = await fetch(`${backendURL}/api/auth/employer/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword: formData.password,
        }),
      })

      const resultText = await response.text()

      if (!response.ok) {
        if (resultText === "Invalid code") {
          setErrors({ general: "Invalid or expired verification code. Please start over." })
        } else if (resultText === "Code expired") {
          setErrors({ general: "Verification code has expired. Please request a new password reset." })
        } else {
          setErrors({ general: "Failed to reset password. Please try again." })
        }
        return
      }

      setIsSuccess(true)
    } catch (error) {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }


  if (isSuccess) {
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
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-2 border-gray-300 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 border-2 border-green-300 animate-pulse">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Password Reset Successful!</CardTitle>
                <CardDescription className="text-gray-600">Your password has been updated successfully</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Password Updated</p>
                      <p className="text-sm text-green-700">You can now sign in with your new password</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  <Link href="/login/employer">Sign In to Your Account</Link>
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>Keep your password secure and don't share it with anyone.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
                <img src="/icons/landing-icon.png" className="w-18 h-18 text-white" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/password-reset-verify">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
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
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-300">
                <Lock className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Reset Your Password</CardTitle>
              <CardDescription className="text-gray-600">Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
                  </Alert>
                )}

                {email && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-sm text-gray-700">Resetting password for:</p>
                    <p className="font-medium text-gray-900">{email}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`border-gray-300 focus:border-gray-500 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`border-gray-300 focus:border-gray-500 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={isLoading}>
                  {isLoading ? "Updating Password..." : "Update Password"}
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

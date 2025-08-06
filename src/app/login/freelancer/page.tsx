"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FreelancerLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkJWT = async () => {
      try {
        const res = await fetch(`${backendURL}/api/auth/verify-token`, {
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          if (data.role === "freelancer") {
            router.replace("/dashboard/freelancer")
          } else if (data.role === "employer") {
            router.replace("/dashboard/employer")
          } else if (data.role === "admin") {
            router.replace("/dashboard/admin")
          }else{
            router.replace("/login/freelancer")
          }
        }
      } catch (err) {
        router.replace("/login/freelancer")
      }
    }

    checkJWT()
  }, [router])
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check Validity of Email
    const checkRes = await fetch(
      `${backendURL}/api/auth/freelancer/check-email?email=${encodeURIComponent(formData.email)}`
    )

    if (!checkRes.ok) {
      setError("No account found with this email address.")
      setIsLoading(false);
      return
    }

    const checkStatus = await fetch(
      `${backendURL}/api/auth/freelancer/check-registration-status?email=${encodeURIComponent(formData.email)}`
    )

    if(!checkStatus.ok) {
      setError("Email not verified. Please check your email for verification link.");
      setIsLoading(false);
      return;
    }

    // Check Registration Provider
    const checkProvider = await fetch(
      `${backendURL}/api/auth/freelancer/check-provider?email=${encodeURIComponent(formData.email)}`
    )
    if (checkProvider.status === 404) {
      setError("No account found with this email address.")
      setIsLoading(false);
      return;
    }else if (checkProvider.status === 403) {
      const text = await checkProvider.text();
      setError("Account registered with Google. Use Google login.");
      setIsLoading(false);
      return;
    }else if (!checkProvider.ok) {
      const text = await checkProvider.text();
      setError("Unexpected error during provider check.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/auth/freelancer/email-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const resultText = await response.text();

      if (!response.ok) {
        if (resultText === "Email and password are required.") {
          setError("Please fill up your email and password.");
          setIsLoading(false);
        } else if (resultText === "Invalid email or password.") {
          setError("Invalid Login Credentials.");
          setIsLoading(false);
        } else if (resultText === "Login failed. Please try again.") {
          setError("Network error occurs. Please try again.");
          setIsLoading(false);
        }
        return;
      }

      router.push(`/dashboard/freelancer`);

    } catch (error) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }

  }

  const handleGoogleLogin = () => {
    window.location.href = `${backendURL}/oauth2/authorization/google-freelancer-login`;
  }

  return (
    <div className="min-h-screen bg-white">
      
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18  rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="/icons/landing-icon.png" className="w-18 h-18 text-white" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login Page
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
                <Users className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Freelancer Login</CardTitle>
              <CardDescription className="text-gray-600">
                Access your freelancer dashboard and find new opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="freelancer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-gray-300 focus:border-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="border-gray-300 focus:border-gray-500 pr-10"
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
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Link href="/login/freelancer/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                    Forgot your password?
                  </Link>
                </div>

                <div className="text-center text-sm text-gray-600">
                  {"Don't have an account? "}
                  <Link href="/register/freelancer" className="text-gray-900 hover:text-black font-medium">
                    Sign up as Freelancer
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

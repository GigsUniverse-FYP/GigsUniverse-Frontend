"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Briefcase, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    

  // check whether JWT exists
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
            router.replace("/login/admin")
          }
        }
      } catch (err) {
        router.replace("/login/admin")
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
      `${backendURL}/api/auth/admin/check-email?email=${encodeURIComponent(formData.email)}`
    )

    if (!checkRes.ok) {
      setError("No account found with this email address.")
      setIsLoading(false);
      return
    }

    try {
      const response = await fetch(`${backendURL}/api/auth/admin/email-login`, {
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

      router.push(`/dashboard/admin`);

    } catch (error) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }

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
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-2 border-gray-400">
                <Briefcase className="w-8 h-8 text-gray-800" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Admin Login</CardTitle>
              <CardDescription className="text-gray-600">
                Moderate platform by managing users, jobs, and more.
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
                    placeholder="admin@example.com"
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

                <Button type="submit" className="w-full mt-5 bg-gray-800 hover:bg-gray-700 text-white" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Link href="/login/admin/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                    Forgot your password?
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FreelancerGoogleSetup() {
  const [id, setId] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateId = () => {
    if (!id.trim()) return "ID is required"
    if (id.length < 3) return "ID must be at least 3 characters long"
    if (!/^[a-zA-Z0-9_]+$/.test(id)) return "ID can only contain letters, numbers, and underscores"
    return null
  }

  const handleContinueWithGoogle = async () => {
    const validationError = validateId()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError("")

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fullId = `${id}@gigsuniverse.freelancer`;

    try {
      const checkRes = await fetch(`${backendURL}/api/auth/freelancer/check-id?id=${fullId}`, {
        credentials: "include",
      })

      if (!checkRes.ok) {
        throw new Error("ID check failed.")
      }

      const data = await checkRes.json()

      if (data.idTaken) {
        setError("This ID is already taken.")
        return
      }

      // Redirect to OAuth2 init
      window.location.href = `${backendURL}/api/auth/freelancer/oauth2-init?id=${encodeURIComponent(fullId)}`
    } catch (err) {
      console.error(err)
      setError("Failed to verify ID. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="/icons/landing-icon.png" className="w-18 h-18 text-white" alt="logo" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/register/freelancer">
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

      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-gray-300 bg-white shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-300">
                <Users className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Choose Your Freelancer ID</CardTitle>
              <CardDescription className="text-gray-600">
                Set up your unique ID before continuing with Google
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Your ID is unchangeable once it is created. Choose carefully!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id" className="text-gray-700">
                    Freelancer ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="id"
                      type="text"
                      placeholder="your-unique-id"
                      value={id}
                      onChange={(e) => {
                        setId(e.target.value)
                        if (error) setError("")
                      }}
                      className={`border-gray-300 focus:border-gray-500 pr-40 ${error ? "border-red-500" : ""}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      @gigsuniverse.freelancer
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your unique ID will be: <strong>{id || "your-unique-id"}@gigsuniverse.freelancer</strong>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We'll verify your ID is available</li>
                    <li>• You'll be redirected to Google to sign in</li>
                    <li>• Your account will be created automatically</li>
                  </ul>
                </div>

                <Button
                  onClick={handleContinueWithGoogle}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying ID..." : "Continue with Google"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Registration Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

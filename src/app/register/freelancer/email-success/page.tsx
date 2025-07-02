"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, User } from "lucide-react"

export default function VerifyEmailSuccess() {
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
            <Link href="/login/freelancer">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all cursor-pointer duration-300"
              >
                <User className="w-4 h-4 mr-2" />
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
              <CardTitle className="text-2xl text-gray-900">Email Verified Successfully!</CardTitle>
              <CardDescription className="text-gray-600">Your freelancer account has been activated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Account Activated</p>
                    <p className="text-sm text-green-700">You can now access all freelancer features</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-3">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">What's next?</p>
                  <ul className="space-y-1 ml-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Complete your freelancer profile</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Browse available projects</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Start applying for gigs</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  <Link href="/login/freelancer">
                    Sign In to Your Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <Link href="/">Back to Landing Page</Link>
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-xs text-gray-600">Welcome to the GigsUniverse community! 🎉</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

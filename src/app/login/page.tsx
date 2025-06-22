import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Shield, ArrowLeft } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
            <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18  rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="icons/landing-icon.png" className="w-18 h-18 text-white" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to GigsUniverse</h1>
            <p className="text-xl text-gray-600">Connect, Create, and Collaborate in the World of Gigs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Freelancer Login */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-gray-400 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-300">
                  <Users className="w-8 h-8 text-gray-700" />
                </div>
                <CardTitle className="text-xl text-gray-900">Freelancer</CardTitle>
                <CardDescription className="text-gray-600">
                  Find amazing projects and showcase your skills to potential clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login/freelancer">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">Login as Freelancer</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Employer Login */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-gray-400 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-2 border-gray-400">
                  <Briefcase className="w-8 h-8 text-gray-800" />
                </div>
                <CardTitle className="text-xl text-gray-900">Employer</CardTitle>
                <CardDescription className="text-gray-600">
                  Post projects and find the perfect freelancers for your business needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login/employer">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">Login as Employer</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Login */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-gray-400 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 border-2 border-gray-500">
                  <Shield className="w-8 h-8 text-gray-900" />
                </div>
                <CardTitle className="text-xl text-gray-900">Admin</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage the platform, users, and ensure smooth operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login/admin">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">Login as Admin</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

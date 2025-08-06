"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SimpleBarChart, SimpleLineChart } from "@/app/components/dashboard_chart"
import {
  DollarSign,
  Briefcase,
  Clock,
  Star,
  ArrowUpRight,
  Activity,
  Target,
  Award,
  Calendar,
  Users,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function FreelancerDashboard() {

  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/onboarding/employer`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to check onboarding status")

        const data = await res.json()
        if (!data.completedOnboarding) {
          router.push("/dashboard/employer/onboarding") 
        }
      } catch (err) {
        console.error("Onboarding check failed:", err)
      }
    }
    checkOnboardingStatus()
  }, [router])

  const earningsData = [
    { label: "Jan", value: 2400 },
    { label: "Feb", value: 1800 },
    { label: "Mar", value: 3200 },
    { label: "Apr", value: 2800 },
    { label: "May", value: 3600 },
    { label: "Jun", value: 4200 },
  ]

  const projectsData = [
    { label: "Completed", value: 47, color: "bg-black" },
    { label: "Active", value: 5, color: "bg-gray-600" },
    { label: "Pending", value: 3, color: "bg-gray-400" },
  ]

  return (
    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8 space-y-6 mb-5">
      {/* Dashboard Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Earned</CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <DollarSign className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">$12,450</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Completed Gigs
            </CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Briefcase className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">47</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +3 this month
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Active Projects
            </CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Clock className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
            <p className="text-xs text-gray-600 font-medium">2 due this week</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Success Rate</CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Target className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">94%</div>
            <p className="text-xs text-gray-600 font-medium">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-black to-gray-800 rounded-lg shadow-sm">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Earnings Overview</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Monthly earnings trend</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">$4,200</div>
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +16.7%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent rounded-lg opacity-50"></div>
              <SimpleLineChart data={earningsData} height={240} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">$18,650</div>
                <div className="text-xs text-gray-500 font-medium">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">$3,108</div>
                <div className="text-xs text-gray-500 font-medium">Avg Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">6</div>
                <div className="text-xs text-gray-500 font-medium">Months</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Star className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">Top Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { skill: "React Development", rating: 4.9, projects: 15 },
              { skill: "UI/UX Design", rating: 4.7, projects: 12 },
              { skill: "Node.js", rating: 4.8, projects: 8 },
            ].map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 text-sm">{skill.skill}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span className="font-semibold text-gray-900 text-sm">{skill.rating}</span>
                  </div>
                </div>
                <Progress value={skill.rating * 20} className="h-2 bg-gray-200 rounded-full" />
                <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3" />
                  {skill.projects} projects completed
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Projects Chart */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">Project Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={projectsData} height={160} />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Recent Earnings</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg text-sm"
              >
                View All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                action: "Completed",
                project: "E-commerce Website Design",
                amount: "$2,850",
                time: "2 hours ago",
                icon: Award,
              },
              {
                action: "Started",
                project: "Mobile App UI/UX",
                amount: "$1,200",
                time: "1 day ago",
                icon: Briefcase,
              },
              {
                action: "Proposal Sent",
                project: "Brand Identity Design",
                amount: "$800",
                time: "2 days ago",
                icon: Star,
              },
              {
                action: "Payment Received",
                project: "Dashboard Development",
                amount: "$3,100",
                time: "3 days ago",
                icon: DollarSign,
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {activity.action} - {activity.project}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
                <Badge className="bg-black text-white border-0 font-semibold text-xs px-3 py-1 rounded-lg">
                  {activity.amount}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deadlines */}
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Upcoming Deadlines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { project: "Logo Design", client: "TechCorp", deadline: "Dec 15", status: "urgent" },
                { project: "Website Development", client: "StartupXYZ", deadline: "Dec 20", status: "normal" },
                { project: "Mobile App UI", client: "DesignHub", deadline: "Dec 25", status: "normal" },
                { project: "Mobile App UI", client: "DesignHub", deadline: "Dec 25", status: "normal" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Added min-w-0 here */}
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.project}</p>{" "}
                    {/* Added truncate */}
                    <p className="text-xs text-gray-500 font-medium truncate">{item.client}</p> {/* Added truncate */}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {" "}
                    {/* Added flex-shrink-0 and ml-4 */}
                    <Badge
                      className={`${
                        item.status === "urgent" ? "bg-black text-white" : "bg-gray-200 text-gray-700 border-gray-300"
                      } font-semibold rounded-lg px-2 py-1 text-xs`}
                    >
                      {item.status === "urgent" ? "Urgent" : "On Track"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                      <Clock className="w-3 h-3" />
                      {item.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

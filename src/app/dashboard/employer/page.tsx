"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  SimpleBarChart,
  SimpleLineChart,
  SimpleDonutChart,
} from "@/app/components/freelancer_components/dashboard_chart"
import {
  DollarSign,
  Briefcase,
  Users,
  Star,
  ArrowUpRight,
  Activity,
  Target,
  Award,
  Calendar,
  ChevronRight,
  Plus,
  TrendingUp,
  Eye,
  Clock,
} from "lucide-react"

export default function EmployerDashboard() {
  const spendingData = [
    { label: "Jan", value: 15000 },
    { label: "Feb", value: 12000 },
    { label: "Mar", value: 18000 },
    { label: "Apr", value: 22000 },
    { label: "May", value: 19000 },
    { label: "Jun", value: 25000 },
  ]

  const applicationsData = [
    { label: "Reviewed", value: 145, color: "bg-black" },
    { label: "Pending", value: 32, color: "bg-gray-600" },
    { label: "Shortlisted", value: 18, color: "bg-gray-400" },
  ]

  const hiringDonutData = [
    { label: "Developers", value: 25, color: "black" },
    { label: "Designers", value: 15, color: "#6b7280" },
    { label: "Writers", value: 8, color: "#d1d5db" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mb-5">
      {/* Dashboard Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Employer Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Spent</CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <DollarSign className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">$111,450</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +15.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Jobs</CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Briefcase className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +3 this week
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Hired Freelancers
            </CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Users className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">48</div>
            <p className="text-xs text-gray-600 font-medium">8 this month</p>
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
            <div className="text-2xl font-bold text-gray-900 mb-1">92%</div>
            <p className="text-xs text-gray-600 font-medium">Project completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">Spending Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={spendingData} height={200} />
          </CardContent>
        </Card>

        {/* Hiring Distribution */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">Hiring by Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SimpleDonutChart data={hiringDonutData} size={120} />
          </CardContent>
        </Card>
      </div>

      {/* Applications Chart */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">Application Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={applicationsData} height={160} />
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
                <CardTitle className="text-lg font-bold text-gray-900">Recent Activity</CardTitle>
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
                action: "New Application",
                project: "Senior React Developer",
                detail: "Sarah Johnson applied",
                time: "2 hours ago",
                icon: Users,
              },
              {
                action: "Job Posted",
                project: "UI/UX Designer",
                detail: "Budget: $3,500",
                time: "1 day ago",
                icon: Briefcase,
              },
              {
                action: "Freelancer Hired",
                project: "Mobile App Development",
                detail: "Mike Chen accepted offer",
                time: "2 days ago",
                icon: Award,
              },
              {
                action: "Payment Sent",
                project: "Brand Identity Design",
                detail: "$2,800 to Alex Rodriguez",
                time: "3 days ago",
                icon: DollarSign,
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
                    <activity.icon className="w-4 h-4 text-white" />
                  </div>
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
                  {activity.detail}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Jobs */}
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Active Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { job: "Senior React Developer", applications: 24, budget: "$5,000" },
                { job: "UI/UX Designer", applications: 18, budget: "$3,500" },
                { job: "Content Writer", applications: 12, budget: "$1,200" },
              ].map((job, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm">{job.job}</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span className="font-semibold text-gray-900 text-sm">{job.applications}</span>
                    </div>
                  </div>
                  <Progress value={(job.applications / 30) * 100} className="h-2 bg-gray-200 rounded-full" />
                  <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                    <DollarSign className="w-3 h-3" />
                    Budget: {job.budget}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 shadow-md bg-gray-50 rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className="w-full h-10 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <a href="/employer/post-job" className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Post New Job
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-10 border border-gray-300 hover:border-black bg-white hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
              >
                <a href="/employer/recommended-talents" className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" />
                  Find Talents
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-10 border border-gray-300 hover:border-black bg-white hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
              >
                <a href="/employer/applications" className="flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Review Applications
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Job Listings */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">Recent Job Postings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { job: "Senior React Developer", applications: 24, deadline: "Dec 20", status: "active" },
              { job: "UI/UX Designer", applications: 18, deadline: "Dec 25", status: "active" },
              { job: "Content Writer", applications: 12, deadline: "Dec 30", status: "draft" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-black transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className={`${
                      item.status === "active" ? "bg-black text-white" : "bg-gray-200 text-gray-700 border-gray-300"
                    } font-semibold rounded-lg px-2 py-1 text-xs`}
                  >
                    {item.status === "active" ? "Active" : "Draft"}
                  </Badge>
                  <span className="text-xs font-semibold text-gray-900">{item.deadline}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{item.job}</h4>
                <p className="text-gray-600 font-medium text-xs flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {item.applications} applications
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

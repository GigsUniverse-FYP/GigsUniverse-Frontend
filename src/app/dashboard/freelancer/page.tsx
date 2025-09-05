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
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const monthMap: Record<string, string> = {
  JANUARY: "Jan",
  FEBRUARY: "Feb",
  MARCH: "Mar",
  APRIL: "Apr",
  MAY: "May",
  JUNE: "Jun",
  JULY: "Jul",
  AUGUST: "Aug",
  SEPTEMBER: "Sep",
  OCTOBER: "Oct",
  NOVEMBER: "Nov",
  DECEMBER: "Dec",
};

interface TaskDeadline {
  project: string;
  deadline: string; 
  status: string;  
  client: string;
}

interface ContractStatusCount {
  [status: string]: number;
}

interface FreelancerDashboardStats {
  totalEarnings: number;
  currentMonthEarnings: number;
  totalCompletedContracts: number;
  currentMonthCompletedContracts: number;
  totalActiveProjects: number;
  activeProjectsThisWeek: number;
  successRate: number; 
}

interface MonthlyEarnings {
  month: string;
  amount: number;
}

interface EarningsOverview {
  totalEarnings: number;
  currentMonthEarnings: number;
  avgMonthly: number;
  last6Months: MonthlyEarnings[];
}

export interface SkillStats {
  skill: string;
  projectsCompleted: number;
  averageRating: number;
}

export interface RecentEarningDTO {
  action: string;
  project: string;
  amount: string;
  time: string;
}

export default function FreelancerDashboard() {

  const router = useRouter();

  // fetching onboarding status check and page
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/onboarding/freelancer`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to check onboarding status")

        const data = await res.json()
        if (!data.completedOnboarding) {
          router.push("/dashboard/freelancer/onboarding") 
        }
      } catch (err) {
        console.error("Onboarding check failed:", err)
      }
    }
    checkOnboardingStatus()
  }, [router])

  const [stats, setStats] = useState<FreelancerDashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/freelancer/dashboard/upper-card`, {
          method: "GET",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data: FreelancerDashboardStats = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const getSuccessRateLabel = (rate: number) => {
    if (rate >= 90) return "Excellent performance";
    if (rate >= 70) return "Above average";
    if (rate >= 50) return "Requires improvement";
    return "Poor performance";
  };

  const [earnings, setEarnings] = useState<EarningsOverview | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/freelancer/dashboard/earnings-overview`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch earnings");

        const data: EarningsOverview = await res.json();
        setEarnings(data);
      } catch (err) {
        console.error("Error fetching earnings:", err);
      }
    };

    fetchEarnings();
  }, []);

  const earningsData = earnings
    ? earnings.last6Months.map((m) => ({
        label: monthMap[m.month] || m.month,
        value: m.amount,
      }))
    : [];

  const [skills, setSkills] = useState<SkillStats[]>([]);

  useEffect(() => {
    const fetchTopSkills = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/freelancer/dashboard/top-skills`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch top skills");

        const data: SkillStats[] = await res.json();
        setSkills(data);
      } catch (err) {
        console.error("Error fetching top skills:", err);
      }
    };

    fetchTopSkills();
  }, []);

  const [contractStatusCount, setContractStatusCount] = useState<ContractStatusCount | null>(null);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/freelancer/dashboard/status-count`, {
          credentials: "include", 
        });
        if (!res.ok) throw new Error("Failed to fetch contract status counts");
        const data: ContractStatusCount = await res.json();
        setContractStatusCount(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchStatusCounts();
  }, []);

  const projectsData =
    contractStatusCount !== null
      ? [
          {
            label: "Completed",
            value: contractStatusCount["completed"] || 0,
            color: "bg-black",
          },
          {
            label: "Active",
            value: contractStatusCount["active"] || 0,
            color: "bg-gray-600",
          },
          {
            label: "Upcoming",
            value: contractStatusCount["upcoming"] || 0,
            color: "bg-gray-600",
          },
          {
            label: "Cancelled",
            value: contractStatusCount["cancelled"] || 0,
            color: "bg-gray-400",
          },
          {
            label: "Pending",
            value: contractStatusCount["pending"] || 0,
            color: "bg-yellow-500",
          },
        ]
      : [];

  const [recentEarnings, setRecentEarnings] = useState<RecentEarningDTO[]>([]);

  useEffect(() => {
    const fetchRecentEarnings = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/freelancer/dashboard/recent`, {
          credentials: "include", 
        });

        if (!res.ok) throw new Error("Failed to fetch recent earnings");
        const data: RecentEarningDTO[] = await res.json();
        setRecentEarnings(data);
      } catch (err) {
        console.error(err);
      } 
    };

    fetchRecentEarnings();
  }, []);

  const [deadlines, setDeadlines] = useState<TaskDeadline[]>([]);

  useEffect(() => {
    const fetchTaskDeadlines = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/freelancer/dashboard/upcoming-deadlines`, {
          method: "GET",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data: TaskDeadline[] = await res.json();
        setDeadlines(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchTaskDeadlines();
  }, []);

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
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
            <div className="text-2xl font-bold text-gray-900 mb-1">${stats?.totalEarnings || 0}</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              ${stats?.currentMonthEarnings || 0} this month
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.totalCompletedContracts || 0}</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +{stats?.currentMonthCompletedContracts || 0} this month
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.totalActiveProjects || 0}</div>
            <p className="text-xs text-gray-600 font-medium">{stats?.activeProjectsThisWeek || 0} due this week</p>
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.successRate || 0}%</div>
            <p className="text-xs text-gray-600 font-medium">{getSuccessRateLabel(stats?.successRate || 0)}</p>
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
                <div className="text-2xl font-bold text-gray-900">${stats?.currentMonthEarnings || 0}</div>
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
                <div className="text-lg font-bold text-gray-900">${earnings?.totalEarnings || 0}</div>
                <div className="text-xs text-gray-500 font-medium">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">${earnings?.avgMonthly.toFixed(2) || 0}</div>
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
          <CardTitle className="text-lg font-bold text-gray-900">
            Top Skills
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-sm">
                  {skill.skill}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-black text-black" />
                  <span className="font-semibold text-gray-900 text-sm">
                    {skill.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <Progress
                value={skill.averageRating * 20}
                className="h-2 bg-gray-200 rounded-full"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <Users className="w-3 h-3" />
                {skill.projectsCompleted} projects completed
              </p>
            </div>
          ))
        ) : (
          <div className="flex-1 p-10 h-full flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
            <p className="text-sm text-gray-500 text-center">
              &nbsp; No Top Skill Record Found. &nbsp;
            </p>
          </div>
        )}
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
       <Card className="lg:col-span-2 border border-gray-200 shadow-md bg-white rounded-xl o">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">Recent Earnings</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {recentEarnings.length > 0 ? (
            recentEarnings.map((earning, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {earning.action} - {earning.project}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {earning.time}
                    </p>
                  </div>
                </div>
                <Badge className="bg-black text-white border-0 font-semibold text-xs px-3 py-1 rounded-lg">
                  {earning.amount}
                </Badge>
              </div>
            ))
          ) : (
          <div className="flex-1 p-10 h-full flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
            <p className="text-sm text-gray-500 text-center">
              &nbsp; No Recent Earning History Found. &nbsp;
            </p>
          </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">
              Upcoming Deadlines
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 min-h-[120px] flex flex-col justify-center min-w-[350px] max-h-80 overflow-y-auto">
          {deadlines.length > 0 ? (
            deadlines.map((item, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item.project}
                  </p>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {item.client ?? "Unknown Client"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">

                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                    <Clock className="w-3 h-3" />
                    {item.deadline}
                  </div>
                </div>
              </div>
            ))
          ) : (
          <div className="flex-1 p-10 h-full flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
            <p className="text-sm text-gray-500 text-center">
              &nbsp; No upcoming deadlines, All Good. &nbsp;
            </p>
          </div>
        )}
        </CardContent>
      </Card>

        </div>
      </div>
    </div>
  )
}

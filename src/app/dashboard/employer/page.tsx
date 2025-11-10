"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleBarChart, SimpleLineChart } from "@/app/components/dashboard_chart"
import {
  DollarSign,
  Briefcase,
  Clock,
  ArrowUpRight,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

interface ContractStatusCount {
  [status: string]: number;
}


export interface EmployerDashboardDTO {
  totalPayout: number;              
  totalPayoutThisMonth: number;      
  completedContracts: number;
  completedContractsThisMonth: number;
  activeContracts: number;
  activeContractsThisMonth: number;  
  totalActiveTasks: number;         
  totalActiveTasksOnDue: number;     
}

interface EmployerPendingTaskDTO {
  taskName: string;
  freelancerId: string;
  freelancerName: string;
  dueDate: string | null;
}


export interface MonthlyPayoutDTO {
  month: string;
  amount: number;
}

export interface EmployerPayoutDTO {
  totalPayout: number;
  currentMonthPayout: number;
  avgMonthly: number;
  last6Months: MonthlyPayoutDTO[];
}

export default function FreelancerDashboard() {
  const router = useRouter()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

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

  const [stats, setStats] = useState<EmployerDashboardDTO | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/dashboard/employer/stats`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");

        const data: EmployerDashboardDTO = await res.json();
        setStats(data);
        console.log("Employer Dashboard Stats:", data);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchDashboardStats();
  }, []);

  const [payouts, setPayouts] = useState<EmployerPayoutDTO | null>(null);

  useEffect(() => {
    const fetchPayoutOverview = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/dashboard/employer/payout-overview`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch employer payout overview");
        const data: EmployerPayoutDTO = await res.json();
        setPayouts(data);
        console.log("Employer Payout Overview:", data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayoutOverview();
  }, [backendUrl]);


  const earningsData = payouts
    ? payouts.last6Months.map((m) => ({
        label: monthMap[m.month] || m.month,
        value: m.amount,
      }))
    : [];

  const [pendingTasks, setPendingTasks] = useState<EmployerPendingTaskDTO[]>([]);

  useEffect(() => {
    const fetchSubmittedTasks = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/dashboard/employer/submitted-tasks`, {
          credentials: "include",
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data: EmployerPendingTaskDTO[] = await res.json();
        setPendingTasks(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubmittedTasks();
  }, [backendUrl]);

  const [contractStatusCount, setContractStatusCount] = useState<ContractStatusCount | null>(null);
  
    useEffect(() => {
      const fetchStatusCounts = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/dashboard/employer/status-count`, {
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
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Payout</CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <DollarSign className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">${(stats?.totalPayout || 0) / 100}</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              + ${(stats?.totalPayoutThisMonth || 0) / 100} from this month
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Completed Contracts
            </CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Briefcase className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.completedContracts || 0}</div>
            <div className="flex items-center text-xs text-gray-600 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +{stats?.completedContractsThisMonth || 0} this month
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Active Contracts
            </CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Clock className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.activeContracts || 0}</div>
            <p className="text-xs text-gray-600 font-medium">+{stats?.activeContractsThisMonth || 0} added this week</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Tasks</CardTitle>
            <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
              <Target className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.totalActiveTasks || 0}</div>
            <p className="text-xs text-gray-600 font-medium">{stats?.totalActiveTasksOnDue || 0} due this week</p>
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
                  <CardTitle className="text-lg font-bold text-gray-900">Payouts Overview</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Monthly payouts trend</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${payouts?.currentMonthPayout || 0}</div>
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
                <div className="text-lg font-bold text-gray-900">${payouts?.totalPayout || 0}</div>
                <div className="text-xs text-gray-500 font-medium">Total Payout</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">${payouts?.avgMonthly.toFixed(2) || 0}</div>
                <div className="text-xs text-gray-500 font-medium">Avg Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">6</div>
                <div className="text-xs text-gray-500 font-medium">Months</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">Submitted Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 min-h-80 overflow-y-auto">
            {pendingTasks.map((task, index) => (
              <div key={index} className="space-y-3 p-3 border border-gray-100 rounded-lg min-w-[300px]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{task.taskName}</h4>
                    <p className="text-xs text-gray-500 mt-1">Client: {task.freelancerName}</p>
                    <p className="text-xs text-gray-500 mt-1">Freelancer ID: {task.freelancerId}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="flex-1 p-15 h-full flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
                <p className="text-sm text-gray-500 text-center">
                  &nbsp; No Submitted Task Available &nbsp;
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
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DollarSign } from "lucide-react"

interface MonthlyTaskEarningsDTO {
  month: string
  totalPay: number
  platformFee: number
}

interface TaskEarningsOverviewDTO {
  totalEarnings: number
  currentMonthEarnings: number
  avgMonthly: number
  last6Months: MonthlyTaskEarningsDTO[]
}

interface MonthlyTaskEarningsChartDTO {
  month: string
  current: number
  previous: number
}

export function EarningsChart() {
  const [earningsData, setEarningsData] = useState<MonthlyTaskEarningsChartDTO[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard/earnings-overview`)
      .then((res) => res.json())
      .then((data: TaskEarningsOverviewDTO) => {
        const chartData: MonthlyTaskEarningsChartDTO[] = data.last6Months.map((item) => ({
          month: item.month,
          current: item.platformFee / 100,
          previous: (item.totalPay - item.platformFee) / 100,
        }))
        setEarningsData(chartData)
      })
      .catch((err) => console.error("Error fetching earnings overview:", err))


  }, [backendUrl])

  const currentMonth = earningsData[earningsData.length - 1]
  const previousMonth = earningsData[earningsData.length - 2]
  const growth = previousMonth
    ? (((currentMonth.current - previousMonth.current) / previousMonth.current) * 100).toFixed(1)
    : "0.0"

  return (
    <div className="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg rounded-xl">
      <div className="p-6 flex flex-col h-[400px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center transition-all duration-300">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Platform Service Fee Earnings</h3>
            <p className="text-sm text-gray-500">Service fee 8%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ChartContainer
            config={{
              current: { label: "Platform Fee", color: "#000000" },
              previous: { label: "Net to Freelancer", color: "#d1d5db" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis axisLine={false} tickFormatter={(value) => `$${value}`} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <Bar dataKey="current" fill="#000000" name="Platform Fee" radius={[2, 2, 0, 0]} />
                <Bar dataKey="previous" fill="#d1d5db" name="Net to Freelancer" radius={[2, 2, 0, 0]} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()} `, name]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

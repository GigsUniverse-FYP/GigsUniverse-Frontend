"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DollarSign } from "lucide-react"

interface MonthlyPayoutDTO {
  month: string
  payouts: number
}

export function PayoutsChart() {
  const [payoutData, setPayoutData] = useState<MonthlyPayoutDTO[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard/payouts`)
      .then((res) => res.json())
      .then((data: MonthlyPayoutDTO[]) => {
        const formatted = data.map((item) => ({
          ...item,
          payouts: item.payouts / 100, 
        }))
        setPayoutData(formatted)
      })
      .catch((err) => console.error("Error fetching payouts:", err))
  }, [backendUrl])


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-6 flex flex-col h-[400px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center transition-all duration-300">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Task Payouts</h3>
            <p className="text-sm text-gray-500">Monthly task payouts processed</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ChartContainer
            config={{
              payouts: { label: "Task Payouts", color: "#6b7280" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payoutData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barSize={20}>
                <CartesianGrid strokeDasharray="1 1" stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis axisLine={false} tickFormatter={(value) => `$${value}`} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()} `, name]}
                />
                <Bar dataKey="payouts" fill="#6b7280" name="Task Payouts " radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MonthlySubscriptionDTO {
  month: string
  earnings: number
  subscribers: number
}

export function SubscriptionEarnings() {
  const [subscriptionData, setSubscriptionData] = useState<MonthlySubscriptionDTO[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard/subscriptions`)
      .then((res) => res.json())
      .then((data: MonthlySubscriptionDTO[]) => setSubscriptionData(data))
      .catch((err) => console.error("Error fetching subscriptions:", err))
  }, [backendUrl])

  const currentMonth = subscriptionData[subscriptionData.length - 1]
  const previousMonth = subscriptionData[subscriptionData.length - 2]
  const growth = previousMonth
    ? (((currentMonth.earnings - previousMonth.earnings) / previousMonth.earnings) * 100).toFixed(1)
    : "0.0"

  const avgMonthly =
    subscriptionData.reduce((sum, month) => sum + month.earnings, 0) / subscriptionData.length

  return (
    <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center transition-all duration-300">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Subscription Earnings</h3>
            <p className="text-sm text-gray-500">Monthly subscription revenue trend</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={subscriptionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Earnings"]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#000000"
                strokeWidth={2}
                dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{currentMonth?.subscribers ?? "-"}</div>
            <div className="text-xs text-gray-500 font-medium">Active Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {avgMonthly >= 1000
                ? `$${(avgMonthly / 1000).toFixed(1)}k`
                : `$${avgMonthly.toFixed(2)}`}
            </div>
            <div className="text-xs text-gray-500 font-medium">Avg Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">6</div>
            <div className="text-xs text-gray-500 font-medium">Months</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

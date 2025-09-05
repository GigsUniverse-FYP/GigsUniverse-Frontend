"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users } from "lucide-react"

interface MonthlyUserRegistrationsDTO {
  month: string
  freelancers: number
  employers: number
}

export function UserGrowthChart() {
  const [userData, setUserData] = useState<MonthlyUserRegistrationsDTO[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard/user-growth`)
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error("Error fetching user growth:", err))
  }, [])


  return (
    <div className="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg rounded-xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center transition-all duration-300">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <p className="text-sm text-gray-500">New user registrations (last 6 months)</p>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer
          config={{
            freelancers: { label: "Freelancers", color: "#000000" },
            employers: { label: "Employers", color: "#666666" },
          }}
          className="h-[280px] w-[100%]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />

              {/* Freelancers Line */}
              <Line
                type="monotone"
                dataKey="freelancers"
                stroke="#000000"
                strokeWidth={2}
                name="Freelancers"
                dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2 }}
              />

              {/* Employers Line */}
              <Line
                type="monotone"
                dataKey="employers"
                stroke="#666666"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Employers"
                dot={{ fill: "#666666", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: "#666666", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}

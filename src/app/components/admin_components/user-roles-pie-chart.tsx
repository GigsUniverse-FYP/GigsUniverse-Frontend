"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users } from "lucide-react"

interface UserRoleDTO {
  name: string
  value: number
  color: string
}

export function UserRolesPieChart() {
  const [roleData, setRoleData] = useState<UserRoleDTO[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard/roles`)
      .then((res) => res.json())
      .then((data) => setRoleData(data))
      .catch((err) => console.error("Error fetching role distribution:", err))
  }, [backendUrl])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Roles</h3>
            <p className="text-sm text-gray-500">System distribution</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex-1 flex items-center justify-center">
          <ChartContainer
            config={{
              freelancers: { label: "Freelancers", color: "#000000" },
              employers: { label: "Employers", color: "#666666" },
              admins: { label: "Admins", color: "#d1d5db" },
            }}
            className="h-[200px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-3">
          {roleData.map((role, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                <span className="text-sm text-gray-600">{role.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{role.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

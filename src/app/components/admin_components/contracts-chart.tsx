"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FileCheck } from "lucide-react"

interface MonthlyCompletedContractsDTO {
  month: string
  completed: number
}

export function ContractsChart() {
  const [contractData, setContractData] = useState<MonthlyCompletedContractsDTO[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard/contracts/completed`)
      .then((res) => res.json())
      .then((data: MonthlyCompletedContractsDTO[]) => {
        setContractData(data)
      })
      .catch((err) => console.error("Error fetching completed contracts:", err))
  }, [backendUrl])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-6 flex flex-col h-[400px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center transition-all duration-300">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Completed Contracts</h3>
            <p className="text-sm text-gray-500">Monthly completed contracts</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ChartContainer
            config={{
              completed: { label: "Completed Contracts", color: "#000000" },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barSize={20}>
                <CartesianGrid strokeDasharray="1 1" stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="#000000" name="Completed Contracts" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

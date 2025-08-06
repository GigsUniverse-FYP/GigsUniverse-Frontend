"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"

interface ChartData {
  label: string
  value: number
  color?: string
}

interface ChartProps {
  data: ChartData[]
  height?: number
}

export function SimpleBarChart({ data, height = 200 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
        <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SimpleLineChart({ data, height = 200 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#666" }}
          tickFormatter={(value: any) => `$${value}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#000000"
          strokeWidth={3}
          dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#000000" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

"use client"

interface SimpleBarChartProps {
  data: { label: string; value: number; color?: string }[]
  height?: number
}

export function SimpleBarChart({ data, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4 justify-between" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden">
              <div
                className={`${item.color || "bg-black"} rounded-2xl transition-all duration-1000 ease-out`}
                style={{
                  height: `${(item.value / maxValue) * (height - 60)}px`,
                  animationDelay: `${index * 100}ms`,
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SimpleLineChartProps {
  data: { label: string; value: number }[]
  height?: number
}

export function SimpleLineChart({ data, height = 200 }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - minValue) / range) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-50 rounded-3xl p-6" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="black" stopOpacity="0.1" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="url(#lineGradient)"
            stroke="black"
            strokeWidth="0.5"
            points={`0,100 ${points} 100,100`}
            className="animate-pulse"
          />
          <polyline
            fill="none"
            stroke="black"
            strokeWidth="0.8"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((item.value - minValue) / range) * 80
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="black"
                className="animate-pulse"
                style={{ animationDelay: `${index * 200}ms` }}
              />
            )
          })}
        </svg>
      </div>
      <div className="flex justify-between">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-500 font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SimpleDonutChartProps {
  data: { label: string; value: number; color?: string }[]
  size?: number
}

export function SimpleDonutChart({ data, size = 120 }: SimpleDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const radius = size / 2 - 10
  const innerRadius = radius * 0.6

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total
            const angle = percentage * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle

            const x1 = size / 2 + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = size / 2 + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = size / 2 + radius * Math.cos((endAngle * Math.PI) / 180)
            const y2 = size / 2 + radius * Math.sin((endAngle * Math.PI) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M ${size / 2} ${size / 2}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ")

            currentAngle += angle

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || (index === 0 ? "black" : index === 1 ? "#6b7280" : "#d1d5db")}
                className="transition-all duration-500 hover:opacity-80"
              />
            )
          })}
          <circle cx={size / 2} cy={size / 2} r={innerRadius} fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-black text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color || (index === 0 ? "black" : index === 1 ? "#6b7280" : "#d1d5db") }}
            />
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm font-black text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

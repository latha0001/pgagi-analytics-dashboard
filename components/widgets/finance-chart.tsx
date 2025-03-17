"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChartData {
  time: string
  price: number
  volume?: number
}

interface FinanceChartProps {
  data: {
    [key: string]: ChartData[]
  }
  timeRanges: string[]
  activeRange: string
  onRangeChange: (range: string) => void
}

export default function FinanceChart({ data, timeRanges, activeRange, onRangeChange }: FinanceChartProps) {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area")

  const chartData = data[activeRange] || []

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs defaultValue={activeRange} onValueChange={onRangeChange}>
          <TabsList>
            {timeRanges.map((range) => (
              <TabsTrigger key={range} value={range}>
                {range}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs defaultValue={chartType} onValueChange={(value) => setChartType(value as "line" | "area" | "bar")}>
          <TabsList>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] w-full">
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
            volume: {
              label: "Volume",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Show fewer ticks on mobile
                    return value
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Price</span>
                              <span className="font-bold text-primary">${payload[0].value?.toFixed(2)}</span>
                            </div>
                            {payload[1] && (
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Volume</span>
                                <span className="font-bold">{payload[1].value}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  animationDuration={500}
                />
                {chartData[0]?.volume && (
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--color-volume)"
                    strokeWidth={1.5}
                    dot={false}
                    opacity={0.7}
                    animationDuration={500}
                  />
                )}
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Price</span>
                              <span className="font-bold text-primary">${payload[0].value?.toFixed(2)}</span>
                            </div>
                            {payload[1] && (
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Volume</span>
                                <span className="font-bold">{payload[1].value}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-price)"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  animationDuration={800}
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Price</span>
                            <span className="font-bold text-primary">${payload[0].value?.toFixed(2)}</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="price" fill="var(--color-price)" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}


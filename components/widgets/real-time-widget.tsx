"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, TrendingDown, TrendingUp } from "lucide-react"

// Mock WebSocket data
const generateMockData = () => {
  const now = new Date()
  return {
    timestamp: now.toISOString(),
    value: Math.floor(Math.random() * 100),
    type: Math.random() > 0.7 ? "alert" : "update",
    change: Math.random() > 0.5 ? "increase" : "decrease",
  }
}

export default function RealTimeWidget() {
  const [data, setData] = useState<Array<{ time: string; value: number }>>([])
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: string; timestamp: Date }>
  >([])
  const [activeTab, setActiveTab] = useState("chart")
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<any>(null)

  // Simulate WebSocket connection
  useEffect(() => {
    // In a real app, this would be a WebSocket connection
    // const ws = new WebSocket('wss://your-websocket-server.com')

    // For demo purposes, we'll use a timer to simulate WebSocket messages
    const connectTimeout = setTimeout(() => {
      setIsConnected(true)

      // Add initial data
      const initialData = Array(20)
        .fill(0)
        .map((_, i) => {
          const time = new Date()
          time.setSeconds(time.getSeconds() - (20 - i))
          return {
            time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            value: Math.floor(Math.random() * 100),
          }
        })

      setData(initialData)
    }, 1000)

    return () => {
      clearTimeout(connectTimeout)
    }
  }, [])

  // Simulate receiving WebSocket messages
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      const mockData = generateMockData()

      // Update chart data
      setData((prevData) => {
        const newData = [
          ...prevData,
          {
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            value: mockData.value,
          },
        ]

        // Keep only the last 20 data points
        if (newData.length > 20) {
          return newData.slice(newData.length - 20)
        }

        return newData
      })

      // Add notification for alerts
      if (mockData.type === "alert") {
        const direction = mockData.change === "increase" ? "increased" : "decreased"
        setNotifications((prev) =>
          [
            {
              id: Date.now().toString(),
              message: `Alert: Value has ${direction} to ${mockData.value}`,
              type: mockData.change,
              timestamp: new Date(),
            },
            ...prev,
          ].slice(0, 10),
        ) // Keep only the last 10 notifications
      }
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [isConnected])

  return (
    <Card className="col-span-1 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Real-Time Data</CardTitle>
            <CardDescription>Live updates and notifications</CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="chart">Live Chart</TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="h-[300px]">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.split(":")[0] + ":" + value.split(":")[1]}
                  />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Value</span>
                              <span className="font-bold text-primary">{payload[0].value}</span>
                              <span className="text-xs text-muted-foreground">{payload[0].payload.time}</span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>Waiting for data...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications">
            <div className="h-[300px] overflow-y-auto space-y-2">
              <AnimatePresence>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-2 rounded-lg border p-3 ${
                        notification.type === "increase"
                          ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
                          : "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
                      }`}
                    >
                      <div
                        className={`mt-0.5 rounded-full p-1 ${
                          notification.type === "increase"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        }`}
                      >
                        {notification.type === "increase" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2">No notifications yet</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


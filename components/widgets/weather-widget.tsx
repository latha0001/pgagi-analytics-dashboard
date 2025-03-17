"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Cloud, Droplets, Search, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for demonstration
const mockWeatherData = {
  location: "New York, US",
  temperature: 18,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: "Mon", temp: 18, condition: "Partly Cloudy" },
    { day: "Tue", temp: 20, condition: "Sunny" },
    { day: "Wed", temp: 17, condition: "Cloudy" },
    { day: "Thu", temp: 16, condition: "Rain" },
    { day: "Fri", temp: 15, condition: "Rain" },
    { day: "Sat", temp: 19, condition: "Partly Cloudy" },
    { day: "Sun", temp: 21, condition: "Sunny" },
  ],
}

export default function WeatherWidget() {
  const [loading, setLoading] = useState(true)
  const [weatherData, setWeatherData] = useState<typeof mockWeatherData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setWeatherData(mockWeatherData)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would fetch weather data for the searched location
    setLoading(true)
    setTimeout(() => {
      setWeatherData({
        ...mockWeatherData,
        location: searchQuery || "New York, US",
      })
      setLoading(false)
    }, 800)
  }

  return (
    <Card className="col-span-1 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Weather</CardTitle>
        <CardDescription>Current conditions and forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        {loading ? (
          <WeatherSkeleton />
        ) : weatherData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{weatherData.location}</h3>
                <p className="text-muted-foreground">{weatherData.condition}</p>
              </div>
              <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-lg border p-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-lg">{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Wind</p>
                  <p className="text-lg">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">7-Day Forecast</h4>
              <div className="grid grid-cols-7 gap-1">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <span className="text-sm font-medium">{day.day}</span>
                    <Cloud className="my-1 h-5 w-5" />
                    <span className="text-sm">{day.temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p>No weather data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function WeatherSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-16" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>

      <div>
        <Skeleton className="mb-2 h-5 w-32" />
        <div className="grid grid-cols-7 gap-1">
          {Array(7)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="my-1 h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}


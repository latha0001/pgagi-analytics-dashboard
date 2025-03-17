"use client"

import type React from "react"

import { useState, Suspense, lazy } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ThemeProvider } from "@/components/theme-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { SkipLink } from "@/components/skip-link"

// Lazy load components for better performance
const LazyWeatherWidget = lazy(() => import("@/components/widgets/weather-widget"))
const LazyNewsWidget = lazy(() => import("@/components/widgets/news-widget"))
const LazyFinanceWidget = lazy(() => import("@/components/widgets/finance-widget"))
const LazyRealTimeWidget = lazy(() => import("@/components/widgets/real-time-widget"))
const LazyGlobeVisualization = lazy(() => import("@/components/visualizations/globe-visualization"))

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SkipLink />
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main id="main-content" className="flex-1 overflow-y-auto bg-background">
            <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>{children}</Suspense>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

// Skeleton loaders for lazy-loaded components
export function WidgetSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}


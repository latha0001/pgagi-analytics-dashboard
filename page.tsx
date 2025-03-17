import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DraggableDashboard from "@/components/dashboard/draggable-dashboard"
import GlobeVisualization from "@/components/visualizations/globe-visualization"
import RealTimeWidget from "@/components/widgets/real-time-widget"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="p-4">
          <DraggableDashboard />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlobeVisualization />
            <RealTimeWidget />
          </div>
        </div>
      </DashboardLayout>
    </main>
  )
}


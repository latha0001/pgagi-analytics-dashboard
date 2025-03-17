"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { updateWidgetOrder } from "@/store/slices/uiSlice"
import WeatherWidget from "@/components/widgets/weather-widget"
import NewsWidget from "@/components/widgets/news-widget"
import FinanceWidget from "@/components/widgets/finance-widget"
import { Button } from "@/components/ui/button"
import { GripVertical } from "lucide-react"

const widgetComponents: Record<string, React.ComponentType> = {
  weather: WeatherWidget,
  news: NewsWidget,
  finance: FinanceWidget,
}

export default function DraggableDashboard() {
  const dispatch = useDispatch()
  const { widgets } = useSelector((state: RootState) => state.ui.dashboardLayout)
  const [isEditing, setIsEditing] = useState(false)
  const [items, setItems] = useState(widgets)

  // Update local state when Redux state changes
  useEffect(() => {
    setItems(widgets)
  }, [widgets])

  // Save the new order to Redux when editing is finished
  const handleEditComplete = () => {
    setIsEditing(false)
    dispatch(updateWidgetOrder(items))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isEditing ? (
          <Button onClick={handleEditComplete} variant="default">
            Save Layout
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Customize Layout
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isEditing ? (
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={setItems}
            className="grid grid-cols-1 gap-4 w-full col-span-full"
          >
            {items.map((id) => {
              const Widget = widgetComponents[id]
              return (
                <Reorder.Item key={id} value={id} className="cursor-move">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute top-2 left-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Widget />
                  </motion.div>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        ) : (
          <>
            {items.map((id) => {
              const Widget = widgetComponents[id]
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={id === "news" ? "col-span-1 md:col-span-2" : "col-span-1"}
                >
                  <Widget />
                </motion.div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}


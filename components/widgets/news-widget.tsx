"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for demonstration
const mockNewsData = {
  categories: ["Technology", "Business", "Sports", "Health", "Entertainment"],
  articles: {
    Technology: [
      {
        id: 1,
        title: "New AI breakthrough changes how machines learn",
        source: "Tech Daily",
        summary:
          "Researchers have developed a new approach to machine learning that could revolutionize AI applications.",
        url: "#",
        image: "/2.webp",
      },
      {
        id: 2,
        title: "Tech giants announce collaboration on open-source project",
        source: "Silicon Valley News",
        summary: "Major technology companies are joining forces to develop a new open-source framework.",
        url: "#",
        image: "3.webp",
      },
    ],
    Business: [
      {
        id: 3,
        title: "Global markets react to new economic policies",
        source: "Financial Times",
        summary: "Stock markets worldwide showed mixed reactions to the newly announced economic policies.",
        url: "#",
        image: "/4.webp",
      },
      {
        id: 4,
        title: "Startup raises $50M in Series B funding",
        source: "Venture Beat",
        summary: "The fintech startup plans to use the funding to expand into new markets and develop new products.",
        url: "#",
        image: "/5.webp",
      },
    ],
    Sports: [
      {
        id: 5,
        title: "Championship finals set after thrilling semifinals",
        source: "Sports Network",
        summary: "The stage is set for an exciting championship final after both semifinals went into overtime.",
        url: "#",
        image: "/6.webp",
      },
    ],
    Health: [
      {
        id: 6,
        title: "New study reveals benefits of intermittent fasting",
        source: "Health Journal",
        summary:
          "Researchers found significant health improvements in participants who practiced intermittent fasting.",
        url: "#",
        image: "/7.webp",
      },
    ],
    Entertainment: [
      {
        id: 7,
        title: "Award-winning director announces new project",
        source: "Entertainment Weekly",
        summary: "The acclaimed director is teaming up with A-list actors for an anticipated new film.",
        url: "#",
        image: "/8.webp",
      },
    ],
  },
}

export default function NewsWidget() {
  const [loading, setLoading] = useState(true)
  const [newsData, setNewsData] = useState<typeof mockNewsData | null>(null)
  const [activeCategory, setActiveCategory] = useState("Technology")

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setNewsData(mockNewsData)
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="col-span-1 md:col-span-2 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Latest News</CardTitle>
        <CardDescription>Stay updated with the latest headlines</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <NewsSkeleton />
        ) : newsData ? (
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4 w-full overflow-auto">
              {newsData.categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {newsData.categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {newsData.articles[category as keyof typeof newsData.articles].map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col md:flex-row gap-4 rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="md:w-1/4">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="h-auto w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="flex flex-col md:w-3/4">
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">{article.source}</p>
                      <p className="mt-2 text-sm">{article.summary}</p>
                      <a
                        href={article.url}
                        className="mt-auto flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Read more <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p>No news data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-auto pb-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-9 w-24 rounded-full" />
          ))}
      </div>
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 rounded-lg border p-4">
            <Skeleton className="h-32 md:h-24 md:w-1/4 rounded-md" />
            <div className="flex flex-col gap-2 md:w-3/4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}


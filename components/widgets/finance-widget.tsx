"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowDown, ArrowUp, Search, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetStockQuoteQuery, useGetStockTimeSeriesQuery, useSearchStocksQuery } from "@/store/apis/financeApi"
import { setSymbol, setTimeRange, addToWatchlist, removeFromWatchlist } from "@/store/slices/financeSlice"
import type { RootState } from "@/store"
import FinanceChart from "./finance-chart"
import { motion, AnimatePresence } from "framer-motion"

export default function FinanceWidget() {
  const dispatch = useDispatch()
  const { symbol, timeRange, watchlist } = useSelector((state: RootState) => state.finance)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string }>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // RTK Query hooks
  const { data: stockQuote, isLoading: isLoadingQuote } = useGetStockQuoteQuery(symbol, {
    // For demo purposes, use mock data
    skip: true,
  })
  const { data: stockTimeSeries, isLoading: isLoadingChart } = useGetStockTimeSeriesQuery(
    { symbol, timeRange },
    {
      // For demo purposes, use mock data
      skip: true,
    },
  )
  const { data: searchData, isLoading: isLoadingSearch } = useSearchStocksQuery(searchQuery, {
    // Only search when query is not empty and has at least 2 characters
    skip: searchQuery.length < 2,
  })

  // Mock data for demonstration
  const mockStockData = {
    symbol: symbol,
    name: symbol === "AAPL" ? "Apple Inc." : symbol === "MSFT" ? "Microsoft Corporation" : "Google Inc.",
    price: 178.72,
    change: 2.34,
    changePercent: 1.32,
    dayRange: { low: 176.5, high: 179.25 },
    volume: "32.5M",
    marketCap: "2.82T",
    timeRanges: ["1D", "1W", "1M", "3M", "1Y", "5Y"],
    chartData: {
      "1D": Array(24)
        .fill(0)
        .map((_, i) => ({
          time: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
          price: 170 + Math.random() * 15,
        })),
      "1W": Array(7)
        .fill(0)
        .map((_, i) => ({
          time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          price: 170 + Math.random() * 15,
        })),
      "1M": Array(30)
        .fill(0)
        .map((_, i) => ({
          time: `Day ${i + 1}`,
          price: 170 + Math.random() * 15,
        })),
      "3M": Array(12)
        .fill(0)
        .map((_, i) => ({
          time: `Week ${i + 1}`,
          price: 165 + Math.random() * 20,
        })),
      "1Y": Array(12)
        .fill(0)
        .map((_, i) => ({
          time: `Month ${i + 1}`,
          price: 160 + Math.random() * 30,
        })),
      "5Y": Array(5)
        .fill(0)
        .map((_, i) => ({
          time: `Year ${i + 1}`,
          price: 120 + Math.random() * 70,
        })),
    },
  }

  // Update search results when search data changes
  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData.slice(0, 5))
    }
  }, [searchData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      setShowSearchResults(true)
    }
  }

  const handleSelectStock = (selectedSymbol: string) => {
    dispatch(setSymbol(selectedSymbol))
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleTimeRangeChange = (range: string) => {
    dispatch(setTimeRange(range))
  }

  const handleAddToWatchlist = () => {
    dispatch(addToWatchlist(symbol))
  }

  const handleRemoveFromWatchlist = (stockSymbol: string) => {
    dispatch(removeFromWatchlist(stockSymbol))
  }

  return (
    <Card className="col-span-1 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Finance</CardTitle>
        <CardDescription>Stock market data and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-4 relative">
          <div className="flex gap-2">
            <Input
              placeholder="Search stock symbol..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.length >= 2) {
                  setShowSearchResults(true)
                } else {
                  setShowSearchResults(false)
                }
              }}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg"
              >
                <ul className="py-1">
                  {searchResults.map((result) => (
                    <li key={result.symbol}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-left"
                        onClick={() => handleSelectStock(result.symbol)}
                      >
                        <span className="font-medium">{result.symbol}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{result.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {isLoadingQuote ? (
          <FinanceSkeleton />
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{mockStockData.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{mockStockData.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${mockStockData.price.toFixed(2)}</p>
                  <p
                    className={`flex items-center text-sm ${
                      mockStockData.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {mockStockData.change >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {mockStockData.change.toFixed(2)} ({mockStockData.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {watchlist.includes(symbol) ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    In Watchlist
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveFromWatchlist(symbol)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove from watchlist</span>
                    </Button>
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleAddToWatchlist}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add to Watchlist
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground">Day Range</p>
                <p className="text-sm">
                  ${mockStockData.dayRange.low.toFixed(2)} - ${mockStockData.dayRange.high.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground">Volume</p>
                <p className="text-sm">{mockStockData.volume}</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-xs text-muted-foreground">Market Cap</p>
                <p className="text-sm">{mockStockData.marketCap}</p>
              </div>
            </div>

            <FinanceChart
              data={mockStockData.chartData}
              timeRanges={mockStockData.timeRanges}
              activeRange={timeRange}
              onRangeChange={handleTimeRangeChange}
            />

            {watchlist.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Watchlist</h4>
                <div className="flex flex-wrap gap-2">
                  {watchlist.map((stockSymbol) => (
                    <Badge
                      key={stockSymbol}
                      variant={stockSymbol === symbol ? "default" : "outline"}
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSelectStock(stockSymbol)}
                    >
                      {stockSymbol}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFromWatchlist(stockSymbol)
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove from watchlist</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FinanceSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
        <div className="text-right">
          <Skeleton className="h-6 w-20 ml-auto" />
          <Skeleton className="mt-1 h-4 w-16 ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>

      <div>
        <div className="flex gap-2 overflow-auto pb-2">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-9 w-12 rounded-full" />
            ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  volume: number
  marketCap: number
}

interface StockChartData {
  symbol: string
  timeRange: string
  data: Array<{
    time: string
    price: number
    volume?: number
  }>
}

export const financeApi = createApi({
  reducerPath: "financeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.alphavantage.co/",
    prepareHeaders: (headers) => {
      // In a real app, this would be an environment variable
      headers.set("X-API-KEY", "YOUR_ALPHA_VANTAGE_API_KEY")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getStockQuote: builder.query<StockQuote, string>({
      query: (symbol) => `query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`,
      // Transform the response to match our interface
      transformResponse: (response: any) => {
        const quote = response["Global Quote"]
        return {
          symbol: quote["01. symbol"],
          name: "", // Alpha Vantage doesn't provide name in this endpoint
          price: Number.parseFloat(quote["05. price"]),
          change: Number.parseFloat(quote["09. change"]),
          changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
          dayHigh: Number.parseFloat(quote["03. high"]),
          dayLow: Number.parseFloat(quote["04. low"]),
          volume: Number.parseInt(quote["06. volume"]),
          marketCap: 0, // Not provided in this endpoint
        }
      },
    }),
    getStockTimeSeries: builder.query<StockChartData, { symbol: string; timeRange: string }>({
      query: ({ symbol, timeRange }) => {
        // Map time range to Alpha Vantage function
        let func = "TIME_SERIES_INTRADAY"
        let interval = "5min"

        switch (timeRange) {
          case "1D":
            func = "TIME_SERIES_INTRADAY"
            interval = "5min"
            break
          case "1W":
            func = "TIME_SERIES_DAILY"
            break
          case "1M":
            func = "TIME_SERIES_DAILY"
            break
          case "3M":
            func = "TIME_SERIES_WEEKLY"
            break
          case "1Y":
            func = "TIME_SERIES_WEEKLY"
            break
          case "5Y":
            func = "TIME_SERIES_MONTHLY"
            break
        }

        return `query?function=${func}&symbol=${symbol}${func === "TIME_SERIES_INTRADAY" ? `&interval=${interval}` : ""}&apikey=demo`
      },
      // Transform the response to match our interface
      transformResponse: (response: any, meta, { symbol, timeRange }) => {
        // This is a simplified transformation - in a real app, you'd handle the different time series formats
        const timeSeriesKey = Object.keys(response).find((key) => key.includes("Time Series"))
        const timeSeries = response[timeSeriesKey]

        const data = Object.entries(timeSeries).map(([time, values]: [string, any]) => ({
          time,
          price: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
        }))

        // Sort by time and limit the number of data points based on timeRange
        const sortedData = data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

        let limitedData = sortedData
        if (timeRange === "1D") limitedData = sortedData.slice(-24)
        if (timeRange === "1W") limitedData = sortedData.slice(-7)
        if (timeRange === "1M") limitedData = sortedData.slice(-30)
        if (timeRange === "3M") limitedData = sortedData.slice(-90)
        if (timeRange === "1Y") limitedData = sortedData.slice(-52)

        return {
          symbol,
          timeRange,
          data: limitedData,
        }
      },
    }),
    searchStocks: builder.query<Array<{ symbol: string; name: string; type: string; region: string }>, string>({
      query: (keywords) => `query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=demo`,
      transformResponse: (response: any) => {
        return response.bestMatches.map((match: any) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
          type: match["3. type"],
          region: match["4. region"],
        }))
      },
    }),
  }),
})

export const { useGetStockQuoteQuery, useGetStockTimeSeriesQuery, useSearchStocksQuery } = financeApi


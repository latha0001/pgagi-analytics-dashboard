import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FinanceState {
  symbol: string
  timeRange: string
  watchlist: string[]
}

const initialState: FinanceState = {
  symbol: "AAPL",
  timeRange: "1D",
  watchlist: ["AAPL", "MSFT", "GOOGL", "AMZN", "META"],
}

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload
    },
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.timeRange = action.payload
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload)
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter((symbol) => symbol !== action.payload)
    },
  },
})

export const { setSymbol, setTimeRange, addToWatchlist, removeFromWatchlist } = financeSlice.actions
export default financeSlice.reducer


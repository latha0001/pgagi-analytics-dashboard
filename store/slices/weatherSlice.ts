import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface WeatherState {
  location: string
  unit: "metric" | "imperial"
  savedLocations: string[]
}

const initialState: WeatherState = {
  location: "",
  unit: "metric",
  savedLocations: [],
}

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload
    },
    toggleUnit: (state) => {
      state.unit = state.unit === "metric" ? "imperial" : "metric"
    },
    addSavedLocation: (state, action: PayloadAction<string>) => {
      if (!state.savedLocations.includes(action.payload)) {
        state.savedLocations.push(action.payload)
      }
    },
    removeSavedLocation: (state, action: PayloadAction<string>) => {
      state.savedLocations = state.savedLocations.filter((location) => location !== action.payload)
    },
  },
})

export const { setLocation, toggleUnit, addSavedLocation, removeSavedLocation } = weatherSlice.actions
export default weatherSlice.reducer


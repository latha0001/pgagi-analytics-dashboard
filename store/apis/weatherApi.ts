import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface WeatherResponse {
  location: {
    name: string
    country: string
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
    }
    humidity: number
    wind_kph: number
    wind_mph: number
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        maxtemp_f: number
        mintemp_c: number
        mintemp_f: number
        condition: {
          text: string
          icon: string
        }
      }
      hour: Array<{
        time: string
        temp_c: number
        temp_f: number
        condition: {
          text: string
          icon: string
        }
      }>
    }>
  }
}

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.weatherapi.com/v1/",
    prepareHeaders: (headers) => {
      // In a real app, this would be an environment variable
      headers.set("key", "YOUR_WEATHER_API_KEY")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getWeather: builder.query<WeatherResponse, { location: string; days?: number }>({
      query: ({ location, days = 7 }) =>
        `forecast.json?q=${encodeURIComponent(location)}&days=${days}&aqi=no&alerts=no`,
    }),
    searchLocations: builder.query<Array<{ id: number; name: string; country: string }>, string>({
      query: (query) => `search.json?q=${encodeURIComponent(query)}`,
    }),
  }),
})

export const { useGetWeatherQuery, useSearchLocationsQuery } = weatherApi


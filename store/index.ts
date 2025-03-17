import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { weatherApi } from "./apis/weatherApi"
import { newsApi } from "./apis/newsApi"
import { financeApi } from "./apis/financeApi"
import weatherReducer from "./slices/weatherSlice"
import newsReducer from "./slices/newsSlice"
import financeReducer from "./slices/financeSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    news: newsReducer,
    finance: financeReducer,
    ui: uiReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [financeApi.reducerPath]: financeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware, newsApi.middleware, financeApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


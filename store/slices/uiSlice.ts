import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  dashboardLayout: {
    widgets: string[]
  }
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: "system",
  dashboardLayout: {
    widgets: ["weather", "news", "finance"],
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    updateWidgetOrder: (state, action: PayloadAction<string[]>) => {
      state.dashboardLayout.widgets = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, setTheme, updateWidgetOrder } = uiSlice.actions
export default uiSlice.reducer


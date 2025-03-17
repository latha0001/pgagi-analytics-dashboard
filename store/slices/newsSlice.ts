import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface NewsState {
  category: string
  searchQuery: string
  savedArticles: string[] // IDs of saved articles
}

const initialState: NewsState = {
  category: "technology",
  searchQuery: "",
  savedArticles: [],
}

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    saveArticle: (state, action: PayloadAction<string>) => {
      if (!state.savedArticles.includes(action.payload)) {
        state.savedArticles.push(action.payload)
      }
    },
    unsaveArticle: (state, action: PayloadAction<string>) => {
      state.savedArticles = state.savedArticles.filter((id) => id !== action.payload)
    },
  },
})

export const { setCategory, setSearchQuery, saveArticle, unsaveArticle } = newsSlice.actions
export default newsSlice.reducer


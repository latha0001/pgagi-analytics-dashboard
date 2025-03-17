import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Article {
  source: {
    id: string | null
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

interface NewsResponse {
  status: string
  totalResults: number
  articles: Article[]
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://newsapi.org/v2/",
    prepareHeaders: (headers) => {
      // In a real app, this would be an environment variable
      headers.set("X-Api-Key", "YOUR_NEWS_API_KEY")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<
      NewsResponse,
      { category?: string; country?: string; pageSize?: number; page?: number }
    >({
      query: ({ category = "technology", country = "us", pageSize = 10, page = 1 }) =>
        `top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&page=${page}`,
    }),
    searchNews: builder.query<NewsResponse, { query: string; pageSize?: number; page?: number }>({
      query: ({ query, pageSize = 10, page = 1 }) =>
        `everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt`,
    }),
  }),
})

export const { useGetTopHeadlinesQuery, useSearchNewsQuery } = newsApi


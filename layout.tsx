import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { I18nProvider } from "@/components/providers/i18n-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Comprehensive analytics dashboard with multiple data sources",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ReduxProvider>
            <I18nProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </I18nProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'
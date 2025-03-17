"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Cloud, Newspaper, Settings, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMobile && open && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isMobile, open, onClose])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && open) {
      onClose()
    }
  }, [pathname, isMobile, open, onClose])

  return (
    <>
      {/* Overlay */}
      {open && isMobile && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-lg font-bold">{t("dashboard.title")}</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <NavItem href="/" icon={<BarChart3 className="h-5 w-5" />} active={pathname === "/"}>
            {t("sidebar.dashboard")}
          </NavItem>
          <NavItem href="/weather" icon={<Cloud className="h-5 w-5" />} active={pathname === "/weather"}>
            {t("sidebar.weather")}
          </NavItem>
          <NavItem href="/news" icon={<Newspaper className="h-5 w-5" />} active={pathname === "/news"}>
            {t("sidebar.news")}
          </NavItem>
          <NavItem href="/finance" icon={<TrendingUp className="h-5 w-5" />} active={pathname === "/finance"}>
            {t("sidebar.finance")}
          </NavItem>
          <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} active={pathname === "/settings"}>
            {t("sidebar.settings")}
          </NavItem>
        </nav>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  active?: boolean
  children: React.ReactNode
}

function NavItem({ href, icon, active, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}


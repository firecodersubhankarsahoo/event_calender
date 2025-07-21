"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { HRProvider } from "@/lib/context/hr-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, Bookmark, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold">
              HR Dashboard
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button key={item.href} variant={isActive ? "default" : "ghost"} size="sm" asChild>
                    <Link href={item.href}>
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HRProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>{children}</main>
        </div>
      </HRProvider>
    </ThemeProvider>
  )
}

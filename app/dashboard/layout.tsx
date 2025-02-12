"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 xl:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 z-50 hidden xl:flex xl:w-72 xl:flex-col">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col xl:pl-72">
        <SiteHeader onSidebarOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
        <SiteFooter className="border-t" />
      </div>
    </div>
  )
} 
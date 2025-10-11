"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "../components/loading-screen"
import { Sidebar } from "../components/sidebar"
// Remove this import
// import { SearchBar } from "../components/search-bar"
import { UserProfileDropdown } from "../components/user-profile-dropdown"
import { DashboardContent } from "../components/dashboard-content"
import { SettingsContent } from "../components/settings-content"
import { NotificationsContent } from "../components/notifications-content"
import { DocumentsView } from "../components/documents-view"
import { ThemeProvider } from "../contexts/theme-context"

// Add these imports for icons
import { BarChart3, FileText, Bell, Settings } from "lucide-react"

// Add this function before the component
const getViewInfo = (activeTab: string) => {
  switch (activeTab) {
    case "dashboard":
      return { title: "Dashboard", icon: BarChart3 }
    case "documents":
      return { title: "Documents", icon: FileText }
    case "notifications":
      return { title: "Notifications", icon: Bell }
    case "settings":
      return { title: "Settings", icon: Settings }
    default:
      return { title: "Dashboard", icon: BarChart3 }
  }
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-card border-b border-border px-4 lg:px-8 py-3 lg:py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              {/* Left side - View Title */}
              <div className="flex items-center space-x-3 pl-12 lg:pl-0">
                {(() => {
                  const viewInfo = getViewInfo(activeTab)
                  const Icon = viewInfo.icon
                  return (
                    <>
                      <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary rounded-md flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary-foreground" />
                      </div>
                      <h1 className="text-xl lg:text-2xl font-medium text-foreground">{viewInfo.title}</h1>
                    </>
                  )
                })()}
              </div>
              {/* Right side - User profile */}
              <div className="ml-4">
                <UserProfileDropdown />
              </div>
            </div>
          </header>

          {/* Main Content - Full height with proper overflow */}
          <main className="flex-1 overflow-hidden">
            {activeTab === "dashboard" && <DashboardContent />}
            {activeTab === "documents" && <DocumentsView />}
            {activeTab === "notifications" && <NotificationsContent />}
            {activeTab === "settings" && <SettingsContent />}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

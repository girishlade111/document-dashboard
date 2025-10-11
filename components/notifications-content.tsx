"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  ChevronDown,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  HelpCircle,
  MessageSquare,
  ClipboardList,
  GraduationCap,
  Loader2,
  X,
} from "lucide-react"

const notificationTabs = [
  { id: "all", label: "All", count: 150 },
  { id: "questions", label: "Questions", count: 45 },
  { id: "answers", label: "Answers", count: 62 },
  { id: "rubrics", label: "Rubrics", count: 23 },
  { id: "grading", label: "Grading", count: 20 },
]

const filterCategories = [
  "Questions",
  "Answers",
  "Rubrics",
  "Grading",
  "Assignments",
  "Reviews",
  "Submissions",
  "Feedback",
]

const filterStatuses = ["Pending", "Approved", "Declined", "Completed", "In Progress"]

// Mock function to generate notifications
const generateNotification = (id: number, type?: string) => {
  const types = ["questions", "answers", "rubrics", "grading"]
  const selectedType = type || types[Math.floor(Math.random() * types.length)]

  const notificationData = {
    questions: {
      icon: HelpCircle,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      senders: ["Dr. Smith", "Prof. Johnson", "Mike Chen", "Sarah Wilson"],
      messages: [
        "submitted a new question for review",
        "asked for clarification on the assignment",
        "requested help with the project",
        "needs assistance with the homework",
      ],
      category: "Questions",
    },
    answers: {
      icon: MessageSquare,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      senders: ["Teaching Assistant", "Dr. Brown", "Sarah Wilson", "Academic Team"],
      messages: [
        "provided an answer to your question",
        "answered your question about the project",
        "responded to your inquiry",
        "gave feedback on your submission",
      ],
      category: "Answers",
    },
    rubrics: {
      icon: ClipboardList,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      senders: ["Academic Team", "Prof. Davis", "Curriculum Committee"],
      messages: [
        "updated the grading rubric",
        "created a new assessment rubric",
        "modified the evaluation criteria",
        "published new grading guidelines",
      ],
      category: "Rubrics",
    },
    grading: {
      icon: GraduationCap,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      senders: ["Prof. Johnson", "Dr. Smith", "Teaching Assistant"],
      messages: [
        "completed grading for Assignment 3",
        "finished reviewing your submission",
        "updated your grade",
        "provided feedback on your work",
      ],
      category: "Grading",
    },
  }

  const data = notificationData[selectedType as keyof typeof notificationData]
  const timeOptions = [
    "2 minutes ago",
    "5 minutes ago",
    "10 minutes ago",
    "15 minutes ago",
    "1 hour ago",
    "2 hours ago",
    "1 day ago",
  ]

  return {
    id,
    type: selectedType,
    icon: data.icon,
    iconColor: data.iconColor,
    iconBg: data.iconBg,
    sender: data.senders[Math.floor(Math.random() * data.senders.length)],
    message: data.messages[Math.floor(Math.random() * data.messages.length)],
    timestamp: timeOptions[Math.floor(Math.random() * timeOptions.length)],
    hasActions: Math.random() > 0.6,
    category: data.category,
  }
}

export function NotificationsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observerRef = useRef<HTMLDivElement>(null)

  // Load initial notifications
  useEffect(() => {
    loadNotifications(1, true)
  }, [activeTab])

  // Load notifications function
  const loadNotifications = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return

      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const itemsPerPage = 10
      const newNotifications = []

      for (let i = 0; i < itemsPerPage; i++) {
        const id = (pageNum - 1) * itemsPerPage + i + 1
        const notification = generateNotification(id, activeTab === "all" ? undefined : activeTab)
        newNotifications.push(notification)
      }

      if (reset) {
        setNotifications(newNotifications)
      } else {
        setNotifications((prev) => [...prev, ...newNotifications])
      }

      // Simulate end of data after 15 pages (150 items)
      if (pageNum >= 15) {
        setHasMore(false)
      }

      setLoading(false)
    },
    [activeTab, loading],
  )

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          loadNotifications(nextPage)
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, page, loadNotifications])

  // Reset when tab changes
  useEffect(() => {
    setNotifications([])
    setPage(1)
    setHasMore(true)
    loadNotifications(1, true)
  }, [activeTab])

  const filteredNotifications = notifications.filter((notification) => {
    if (
      searchQuery &&
      !notification.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.sender.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    if (selectedCategory !== "All" && notification.category !== selectedCategory) return false
    return true
  })

  const totalNotifications = notificationTabs.find((tab) => tab.id === activeTab)?.count || 0
  const pendingRequests = notifications.filter((n) => n.hasActions).length

  return (
    <div className="flex-1 bg-background h-full">
      <div className="h-full flex flex-col min-h-0">
        <div className="flex-shrink-0 p-4 lg:p-8 pb-0">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <p className="text-muted-foreground text-sm lg:text-base">
              You currently have <span className="font-medium">"{pendingRequests} requests"</span>
            </p>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full lg:w-80 bg-input border-border"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-card border-border text-foreground justify-between">
                    <span className="truncate">Category: {selectedCategory}</span>
                    <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border w-56">
                  <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All</DropdownMenuItem>
                  {filterCategories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-card border-border text-foreground"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters && <X className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
              {notificationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-secondary text-secondary-foreground">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 px-4 lg:px-8 h-full min-h-0">
            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 lg:space-y-4 pb-8">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <Card key={notification.id} className="bg-card border-border hover:shadow-theme-sm transition-all">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-start space-x-3 lg:space-x-4">
                          {/* Icon */}
                          <div className={`p-2 rounded-lg ${notification.iconBg} flex-shrink-0`}>
                            <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${notification.iconColor}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-3 lg:space-y-0">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">
                                  <span className="font-medium">{notification.sender}</span>{" "}
                                  <span className="text-muted-foreground">{notification.message}</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                              </div>

                              {/* Actions */}
                              {notification.hasActions && (
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground bg-transparent text-xs lg:text-sm"
                                  >
                                    <XCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                                    Decline
                                  </Button>
                                  <Button size="sm" className="button-primary text-xs lg:text-sm">
                                    <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin text-muted-foreground mr-2" />
                    <span className="text-muted-foreground text-sm lg:text-base">Loading more notifications...</span>
                  </div>
                )}

                {/* End of data indicator */}
                {!hasMore && filteredNotifications.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm lg:text-base">
                      You've reached the end of notifications
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {filteredNotifications.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">No notifications found</h3>
                    <p className="text-muted-foreground text-sm lg:text-base">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}

                {/* Intersection observer target */}
                <div ref={observerRef} className="h-4" />
              </div>
            </div>

            {/* Filters Sidebar - Scrollable */}
            {showFilters && (
              <div className="w-full lg:w-80 flex-shrink-0 order-first lg:order-last">
                <div className="h-full overflow-y-auto">
                  <Card className="bg-card border-border">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base lg:text-lg font-medium text-foreground">Filters</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowFilters(false)}
                          className="lg:hidden h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {/* Category Filters */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
                          <div className="space-y-2">
                            {filterCategories.map((category) => (
                              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">{category}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Status Filters */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
                          <div className="space-y-2">
                            {filterStatuses.map((status) => (
                              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Time Range */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Time Range</h4>
                          <div className="space-y-2">
                            {["Today", "This Week", "This Month", "Last 3 Months", "All Time"].map((range) => (
                              <label key={range} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="timeRange"
                                  className="border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">{range}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Priority</h4>
                          <div className="space-y-2">
                            {["High", "Medium", "Low"].map((priority) => (
                              <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">{priority}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-border">
                        <Button variant="outline" className="w-full bg-card border-border text-foreground">
                          Clear All Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { VirtualizedDataTable } from "./virtualized-data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Calendar } from "lucide-react"

interface Task {
  id: number
  name: string
  description: string
  estimate: string
  type: string
  typeColor: string
  assignees: Array<{
    name: string
    avatar: string
    initials: string
  }>
  priority: "High" | "Medium" | "Low"
  priorityColor: string
  status: "To-do" | "In Progress" | "In Review" | "Completed"
}

const tasks: Task[] = [
  {
    id: 1,
    name: "Employee Onboarding Document",
    description: "Information about employees",
    estimate: "Feb 14, 2024 - Feb 1, 2024",
    type: "Document",
    typeColor: "bg-blue-100 text-blue-800",
    assignees: [
      { name: "John Doe", avatar: "/placeholder.svg?height=24&width=24", initials: "JD" },
      { name: "Jane Smith", avatar: "/placeholder.svg?height=24&width=24", initials: "JS" },
    ],
    priority: "Medium",
    priorityColor: "bg-yellow-100 text-yellow-800",
    status: "To-do",
  },
  {
    id: 2,
    name: "Business Cards Design",
    description: "Create new business card templates",
    estimate: "Feb 14, 2024 - Feb 1, 2024",
    type: "Design",
    typeColor: "bg-purple-100 text-purple-800",
    assignees: [{ name: "Mike Johnson", avatar: "/placeholder.svg?height=24&width=24", initials: "MJ" }],
    priority: "High",
    priorityColor: "bg-red-100 text-red-800",
    status: "In Progress",
  },
  // Generate more sample data for testing
  ...Array.from({ length: 48 }, (_, i) => ({
    id: i + 3,
    name: `Task ${i + 3}: ${["Research", "Design", "Development", "Testing", "Documentation"][i % 5]} Phase`,
    description: Math.random() > 0.5 ? `Detailed description for task ${i + 3}` : "-",
    estimate: "Feb 14, 2024 - Feb 1, 2024",
    type: ["Document", "Design", "Wireframe", "Video Ads", "Public Ads", "Research"][i % 6],
    typeColor: [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-cyan-100 text-cyan-800",
    ][i % 6],
    assignees: [
      {
        name: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Alex Chen"][i % 5],
        avatar: "/placeholder.svg?height=24&width=24",
        initials: ["JD", "JS", "MJ", "SW", "AC"][i % 5],
      },
    ],
    priority: ["High", "Medium", "Low"][i % 3] as "High" | "Medium" | "Low",
    priorityColor: ["bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800", "bg-gray-100 text-gray-800"][i % 3],
    status: ["To-do", "In Progress", "In Review", "Completed"][i % 4] as Task["status"],
  })),
]

const viewTabs = [
  { id: "kanban", label: "Kanban" },
  { id: "timeline", label: "Timeline" },
  { id: "list", label: "List" },
]

export function DocumentsView() {
  const [activeTab, setActiveTab] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "name",
      header: "Task Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground text-sm">{row.getValue("name")}</div>
          {row.original.description !== "-" && (
            <div className="text-xs text-muted-foreground mt-1">{row.original.description}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "estimate",
      header: "Estimates",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{row.getValue("estimate")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge className={`text-xs ${row.original.typeColor}`}>{row.getValue("type")}</Badge>,
    },
    {
      accessorKey: "assignees",
      header: "People",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          {row.original.assignees.map((assignee, index) => (
            <Avatar key={index} className="h-6 w-6 border border-background">
              <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <Badge className={`text-xs ${row.original.priorityColor}`}>{row.getValue("priority")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem className="text-sm text-foreground hover:bg-secondary/50">Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-foreground hover:bg-secondary/50">Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-foreground hover:bg-secondary/50">Move to</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-destructive hover:bg-destructive/10">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const handleRowClick = (task: Task) => {
    console.log("Task clicked:", task)
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 lg:p-8">
        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-6 lg:space-x-8 overflow-x-auto">
            {viewTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-48 lg:w-64 bg-input border-border"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 sm:flex-none bg-card border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="flex-1 sm:flex-none button-primary">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Task</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {activeTab === "list" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">All Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Manage your tasks with advanced table features, sorting, and virtualization
              </p>
            </div>
            <VirtualizedDataTable
              columns={columns}
              data={tasks}
              searchPlaceholder="Search tasks..."
              pageSize={12}
              enableSearch={true}
              enableSorting={true}
              enablePagination={true}
              onRowClick={handleRowClick}
            />
          </div>
        )}

        {/* Placeholder for other views */}
        {activeTab !== "list" && (
          <div className="flex items-center justify-center h-64 bg-card border border-border rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                {viewTabs.find((t) => t.id === activeTab)?.label} View
              </h3>
              <p className="text-muted-foreground">This view is coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

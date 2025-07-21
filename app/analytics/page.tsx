"use client"

import { useUsers } from "@/hooks/use-users"
import { useHR } from "@/lib/context/hr-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Bookmark, BarChart3 } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function AnalyticsPage() {
  const { allUsers } = useUsers()
  const { state } = useHR()

  // Department-wise average ratings
  const departmentData = allUsers.reduce(
    (acc, user) => {
      const dept = user.company.department
      if (!acc[dept]) {
        acc[dept] = { total: 0, count: 0, bookmarks: 0 }
      }
      acc[dept].total += user.rating
      acc[dept].count += 1
      if (state.bookmarkedUsers.includes(user.id)) {
        acc[dept].bookmarks += 1
      }
      return acc
    },
    {} as Record<string, { total: number; count: number; bookmarks: number }>,
  )

  const departmentChartData = Object.entries(departmentData).map(([dept, data]) => ({
    department: dept,
    avgRating: Number((data.total / data.count).toFixed(1)),
    employees: data.count,
    bookmarks: data.bookmarks,
  }))

  // Rating distribution
  const ratingDistribution = allUsers.reduce(
    (acc, user) => {
      const rating = Math.floor(user.rating)
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const ratingChartData = Object.entries(ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count,
    percentage: ((count / allUsers.length) * 100).toFixed(1),
  }))

  // Bookmark trends (mock data)
  const bookmarkTrends = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short" })
    return {
      month,
      bookmarks: Math.floor(Math.random() * 10 + 5),
      promotions: Math.floor(Math.random() * 5 + 2),
    }
  }).reverse()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Insights and trends from your HR data</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allUsers.length > 0
                ? (allUsers.reduce((sum, user) => sum + user.rating, 0) / allUsers.length).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.bookmarkedUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {((state.bookmarkedUsers.length / allUsers.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentChartData.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgRating: {
                  label: "Average Rating",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgRating" fill="var(--color-avgRating)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Employees",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ratingChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmark Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bookmarks: {
                  label: "Bookmarks",
                  color: "hsl(var(--chart-3))",
                },
                promotions: {
                  label: "Promotions",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookmarkTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="bookmarks" stroke="var(--color-bookmarks)" />
                  <Line type="monotone" dataKey="promotions" stroke="var(--color-promotions)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bookmarks: {
                  label: "Bookmarks",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="bookmarks" fill="var(--color-bookmarks)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

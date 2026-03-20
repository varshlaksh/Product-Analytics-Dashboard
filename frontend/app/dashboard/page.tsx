"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Calendar, TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowUpRight } from "lucide-react"

// Sample data for charts
const barChartData = [
  { month: "Jan", visitors: 4500, conversions: 1200 },
  { month: "Feb", visitors: 5200, conversions: 1400 },
  { month: "Mar", visitors: 4800, conversions: 1100 },
  { month: "Apr", visitors: 6100, conversions: 1800 },
  { month: "May", visitors: 7200, conversions: 2100 },
  { month: "Jun", visitors: 6800, conversions: 1900 },
  { month: "Jul", visitors: 7500, conversions: 2300 },
  { month: "Aug", visitors: 8100, conversions: 2500 },
]

const lineChartData = [
  { date: "Week 1", revenue: 12500, expenses: 8200 },
  { date: "Week 2", revenue: 15200, expenses: 9100 },
  { date: "Week 3", revenue: 14800, expenses: 8800 },
  { date: "Week 4", revenue: 18100, expenses: 10200 },
  { date: "Week 5", revenue: 19500, expenses: 11000 },
  { date: "Week 6", revenue: 21200, expenses: 11800 },
  { date: "Week 7", revenue: 20100, expenses: 12100 },
  { date: "Week 8", revenue: 23500, expenses: 13500 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  conversions: {
    label: "Conversions",
    color: "var(--chart-2)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-4)",
  },
}

const stats = [
  {
    title: "Total Visitors",
    value: "48,352",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$124,500",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    trend: "down",
    icon: Activity,
  },
  {
    title: "Avg. Session",
    value: "4m 32s",
    change: "+1.2%",
    trend: "up",
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [ageFilter, setAgeFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">Track your key metrics and performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] bg-card border-border">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-[130px] bg-card border-border">
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="18-24">18-24</SelectItem>
              <SelectItem value="25-34">25-34</SelectItem>
              <SelectItem value="35-44">35-44</SelectItem>
              <SelectItem value="45-54">45-54</SelectItem>
              <SelectItem value="55+">55+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[130px] bg-card border-border">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-border text-foreground">
            Export
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-accent" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-accent" : "text-destructive"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Visitors & Conversions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monthly breakdown of site traffic and conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="visitors"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="conversions"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-chart-1" />
                <span className="text-muted-foreground">Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-chart-2" />
                <span className="text-muted-foreground">Conversions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line/Area Chart */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Weekly revenue and expense trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  fill="url(#expensesGradient)"
                />
              </AreaChart>
            </ChartContainer>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-chart-1" />
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-chart-4" />
                <span className="text-muted-foreground">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Line Chart */}
        <Card className="border-border/50 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Trends</CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time performance metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart
                data={lineChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ fill: "var(--chart-1)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ fill: "var(--chart-2)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Stats</CardTitle>
            <CardDescription className="text-muted-foreground">
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Page Views", value: "125,432", percentage: 78 },
              { label: "Bounce Rate", value: "32.4%", percentage: 32 },
              { label: "Session Duration", value: "5m 12s", percentage: 65 },
              { label: "New Users", value: "8,234", percentage: 45 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

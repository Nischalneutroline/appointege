'use client'

import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A donut chart with an active sector'

const chartData = [
  { service: 'chrome', count: 275, fill: 'var(--color-chrome)' },
  { service: 'safari', count: 200, fill: 'var(--color-safari)' },
  { service: 'firefox', count: 187, fill: 'var(--color-firefox)' },
  { service: 'edge', count: 173, fill: 'var(--color-edge)' },
  { service: 'other', count: 90, fill: 'var(--color-other)' },
]

const chartConfig = {
  count: {
    label: 'Count',
  },
  chrome: {
    label: 'Teeth Cleaning',
    color: 'var(--chart-1)',
  },
  safari: {
    label: 'Teeth Implant',
    color: 'var(--chart-2)',
  },
  firefox: {
    label: 'Bleaching',
    color: 'var(--chart-3)',
  },
  edge: {
    label: 'Teeth Whitening',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function DashboardPieChart() {
  // Custom label renderer to show percentage
  const renderCustomLabel = ({ percent }: { percent: number }) => {
    return `${(percent * 100).toFixed(1)}%`
  }
  return (
    <div className="flex flex-col">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut Active</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <div className="flex flex-col">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full aspect-square max-h-[230px]"
          >
            <PieChart className="">
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                label={renderCustomLabel}
                data={chartData}
                dataKey="count"
                nameKey="service"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {chartData.length}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Services
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <div className="flex flex-wrap gap-2 items-start">
          {chartData.map((item) => (
            <div key={item.service} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{
                  backgroundColor:
                    chartConfig[item.service as keyof typeof chartConfig]
                      ?.color || item.fill,
                }}
              />
              <span className="text-xs text-muted-foreground">
                {chartConfig[item.service as keyof typeof chartConfig]?.label} (
                {item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total count for the last 6 months
        </div>
      </CardFooter> */}
    </div>
  )
}

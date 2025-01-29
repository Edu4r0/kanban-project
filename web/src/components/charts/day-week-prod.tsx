import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDaysTasks } from "@/types";

const chartConfig = {
  tasks: {
    label: "# Tareas",
    color: "hsl(var(--chart-2))",
  },

} satisfies ChartConfig;

interface ChartDayWeekPro {
  chartData: ChartDaysTasks[];
}

export function ChartDayWeekPro({ chartData }: ChartDayWeekPro) {
  return (
    <ChartContainer className="max-h-[350px] " config={chartConfig}>
    <BarChart
      accessibilityLayer
      data={chartData}
      layout="vertical"
      margin={{
        left: 20,
      }}
    >
      <YAxis
        dataKey="day"
        type="category"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
       
      />
      <XAxis dataKey="tasks" type="number" hide />
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent hideLabel />}
        
      />
      <Bar color="var(--color-tasks)" dataKey="tasks" fill="var(--color-tasks)" radius={5} />
    </BarChart>
  </ChartContainer>
  );
}

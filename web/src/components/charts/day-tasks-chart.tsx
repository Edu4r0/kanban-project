import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDaysTasks } from "@/types";

const chartConfig = {
  tasks: {
    label: "Tareas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartDaysTaksProps {
  chartData: ChartDaysTasks[];
}

export default function ChartDaysTaks({ chartData }: ChartDaysTaksProps) {
  return (
    <ChartContainer className="max-h-[350px] mx-auto" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="tasks"
          type="bump"
          fill="var(--color-tasks)"
          fillOpacity={0.4}
          stroke="var(--color-tasks)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

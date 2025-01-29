import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedNumber } from "@/components/animated-number";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Ban,
  CircleCheck,
  CircleDashed,
  TrendingUp,
  ListTodo,
  Check,
  CalendarCogIcon,
} from "lucide-react";
import DashboardSection from "@/components/layout/dashboard-section";
import TasksRecents from "@/components/tasks/recent-tasks";
import { useTasks } from "@/context/tasks-context";
import { useEffect, useState } from "react";
import { TaskMetricsResponse } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ChartDaysTaks from "@/components/charts/day-tasks-chart";
import { ChartDayWeekPro } from "@/components/charts/day-week-prod";

function DashboardPage() {
  const { getTasksMetrics } = useTasks();

  const [data, setData] = useState<TaskMetricsResponse>({
    tasks: {
      data: {
        value: 0,
        charts: {
          "chart-days": [],
          "chart-day-prooductivity": [],
        },
        recentTasks: [],
      },
      pending: {
        value: 0,
      },
      completed: {
        value: 0,
      },
      canceled: {
        value: 0,
      },
      analitycs: {
        average: 0,
        productivity: 0,
      },
    },
  });

  useEffect(() => {
    async function fetch() {
      const result = await getTasksMetrics();
      setData(result);
    }
    fetch();
  }, [getTasksMetrics]);

  const { tasks } = data;

  return (
    <>
      <DashboardSection
        title="Panel de control"
        description="Aca encontraras las estadisticas, metricas y demas relacionadas con tus tareas"
      />
      <Tabs defaultValue="resume">
        <TabsList>
          <TabsTrigger value="resume">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Productividad</TabsTrigger>
        </TabsList>
        <TabsContent value="resume" className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.data.value} />
                </div>
                <p className="text-xs text-muted-foreground">Total de tareas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendientes
                </CardTitle>
                <CircleDashed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.pending.value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de tareas pendientes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completadas
                </CardTitle>
                <CircleCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.completed.value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de tareas completadas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Canceladas
                </CardTitle>
                <Ban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.canceled.value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de tareas canceladas
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full">
            <Card className="col-span-4  w-full">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2 w-full">
                  <CardTitle>Transaciones</CardTitle>
                  <CardDescription>
                    Tareas por mes ultimos +5 meses
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    to="/dashboard/tasks"
                  >
                    Ver Todo
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartDaysTaks chartData={tasks.data.charts["chart-days"]} />
              </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3 w-full">
              <CardHeader>
                <CardTitle>Tareas Recientes</CardTitle>
                <CardDescription>
                  Estas son las tareas mas recientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksRecents data={tasks.data.recentTasks} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Eficiencia
                </CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedNumber value={tasks.analitycs.productivity} />
                  %

                </div>
                <p className="text-xs text-muted-foreground">
                  Porcentage de tareas completadas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendientes
                </CardTitle>
                <CircleDashed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.pending.value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de tareas pendientes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Promedio de tareas
                </CardTitle>
                <CalendarCogIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.analitycs.average} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Promedio de tareas x día
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Canceladas
                </CardTitle>
                <Ban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +
                  <AnimatedNumber value={tasks.canceled.value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de tareas canceladas
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full">
          <Card className="col-span-5 lg:col-span-4 w-full" >
              <CardContent className="pl-2 py-2">
                <ChartDayWeekPro
                  chartData={tasks.data.charts["chart-day-prooductivity"]}
                />
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4 ">
                <div className="flex gap-2 font-medium leading-none">
                  Aca puedes vizualizar que dia de la semana eres más productivo{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Mostrando el total de resultados de los últimos 5 meses
                </div>
              </CardFooter>
            </Card>
               <div className="col-span-4 lg:col-span-3 w-full"></div>
            {/* 
            
            <Card className="col-span-4 lg:col-span-3 w-full">
            <CardHeader>
            <CardTitle>Tareas Recientes</CardTitle>
            <CardDescription>
            Estas son las tareas mas recientes
            </CardDescription>
            </CardHeader>
            <CardContent>
            <TasksRecents data={tasks.data.recentTasks} />
            </CardContent>
            </Card>
            */}
            
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default DashboardPage;

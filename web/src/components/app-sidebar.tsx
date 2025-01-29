"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  ListTodo,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useTasks } from "@/context/tasks-context";
import { NavTasks, NavTasksSkeleton } from "./nav-tasks";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Todo List",
      logo: GalleryVerticalEnd,
      plan: "Prueba-Tecnica",
    },
    
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Resumen",
          url: "/dashboard?tab=resume",
        },
        {
          title: "Productividad",
          url: "/dashboard?tab=analytics",
        },
      ],
    },
    {
      title: "Tareas",
      url: "/dashboard/tasks",
      icon: ListTodo,
      items: [],
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { tasks } = useTasks()
  console.log(tasks);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {tasks.length >= 0 ? <NavTasks tasks={tasks} /> : <NavTasksSkeleton />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

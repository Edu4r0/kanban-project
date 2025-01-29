import { z } from "zod";
import { authRegisterSchema, taskSchema } from "./lib/shemas";
import { authSchema } from "./lib/shemas";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null; // Replace 'any' with the appropriate type if known
  signup: (user: z.infer<typeof authRegisterSchema>) => Promise<AuthResponse>;
  signin: (user: z.infer<typeof authSchema>) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  errors: string[]; // Adjust type as necessary
  loading: boolean;
}

export type ChartDaysTasks = {
  day: string;
  tasks: number;
};

export type TaskMetricsResponse = {
  tasks: {
    data: {
      value: number; // Total de tareas
      charts: {
        "chart-days": ChartDaysTasks[]; // Lista de tareas por día
        "chart-day-prooductivity": ChartDaysTasks[]; // Lista de tareas por día
      };
      recentTasks: Task[]; // Lista de tareas recientes
    };
    canceled: {
      value: number; // Número de tareas canceladas
    };
    pending: {
      value: number; // Número de tareas pendientes
    };
    completed: {
      value: number; // Número de tareas completadas
    };
    analitycs: {
      average: number; // Promedio de tareas por día
      productivity: number; // Porcentaje de productividad
    };
  };
};

export interface Task extends z.infer<typeof taskSchema> {
  date: Date;
}

export interface TaskRespose {
  success: boolean;
  message: string;
}

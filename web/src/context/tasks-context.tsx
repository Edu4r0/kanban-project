import { createContext, useContext, useCallback } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksMetricsRequest,
  getTasksRequest,
  updateTaskRequest,
} from "@/lib/querys/tasks";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "@/lib/shemas";
import { TaskMetricsResponse, TaskRespose, Task as TaskType } from "@/types";
import { AxiosError } from "axios";
import React from "react";
import { useOptimisticUpdate } from "@/hooks/use-optimistic-tasks";

interface TaskContextType {
  tasks: TaskType[];
  getTasks: () => Promise<void>;
  deleteTask: (id: string) => Promise<TaskRespose>;
  createTask: (task: z.infer<typeof createTaskSchema>) => Promise<TaskRespose>;
  updateTaskOptimistic: (
    taskId: string,
    updates: Partial<TaskType>
  ) => Promise<void>;
  updateTask: (task: z.infer<typeof updateTaskSchema>) => Promise<TaskRespose>;
  getTasksMetrics: () => Promise<TaskMetricsResponse>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

interface TaskProviderProps {
  children?: React.ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const {
    items: tasks,
    setItems,
    updateItem,
    rollbackItem,
  } = useOptimisticUpdate<TaskType>([]);

  const getTasks = useCallback(async () => {
    const res = await getTasksRequest();
    setItems(res.data);
  }, [setItems]);

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskRequest(id);
      setItems((prev) => prev.filter((task) => task._id !== id));
      return { success: true, message: "Task deleted successfully" };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error?.response?.data?.message || "An error occurred",
        };
      }
      return { success: false, message: "Unexpected error" };
    }
  };

  const updateTask = async (task:z.infer<typeof updateTaskSchema>) => {
    try {
      await updateTaskRequest(task);
      setItems((prev) => prev.map((t) => (t._id === task._id ? { ...t, ...task } : t)));
      return { success: true, message: "Task updated successfully" };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error?.response?.data?.message || "An error occurred",
        };
      }
      return { success: false, message: "Unexpected error" };
    }
  };

  const createTask = async (task: z.infer<typeof createTaskSchema>) => {
    try {
      const res = await createTaskRequest(task);
      setItems((prev) => [...prev, res.data]);
      return { success: true, message: res.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error?.response?.data?.message || "An error occurred",
        };
      }
      return { success: false, message: "Unexpected error" };
    }
  };


  const getTasksMetrics = async () => {
    try {
      const res = await getTasksMetricsRequest();
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskOptimistic = async (
    taskId: string,
    updates: Partial<TaskType>
  ) => {
    const originalTask = tasks.find((task) => task._id === taskId);

    if (!originalTask) {
      console.error("Task not found");
      return;
    }

    updateItem(taskId, updates);

    try {
      await updateTaskRequest({ ...originalTask, ...updates });
    } catch (error) {
      console.error("Failed to update task, rolling back", error);
      rollbackItem(taskId, originalTask);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        deleteTask,
        updateTask,
        createTask,
        updateTaskOptimistic,
        getTasksMetrics,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

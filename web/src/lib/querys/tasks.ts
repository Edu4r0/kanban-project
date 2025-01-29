import axios from "axios";
import { z } from "zod";
import { updateTaskSchema, createTaskSchema } from "@/lib/shemas";

export const getTasksRequest = async () => axios.get("/api/tasks");

export const createTaskRequest = async (
  task: z.infer<typeof createTaskSchema>
) => axios.post("/api/tasks", task);

export const getTasksMetricsRequest = async () =>
  axios.get("/api/tasks/metrics");

export const updateTaskRequest = async (
  task: z.infer<typeof updateTaskSchema>
) => axios.put(`/api/tasks/${task._id}`, task);

export const deleteTaskRequest = async (id: string) =>
  axios.delete(`/api/tasks/${id}`);

export const getTaskRequest = async (id: string) =>
  axios.get(`/api/tasks/${id}`);

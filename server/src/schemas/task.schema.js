import { z } from "zod";
export const taskStatus = z.enum([
  "in progress",
  "done",
  "canceled",
  "backlog",
  "todo",
]);

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  status: taskStatus,
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});

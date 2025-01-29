import { z } from "@/lib/es-zod";

export const authSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido" })
    .email({ message: "El correo no es válido" }),
  password: z
    .string()
    .min(5, { message: "La contraseña debe tener al menos 5 caracteres" })
    .max(10, {
      message: "La contraseña tiene un máximo de 10 caracteres",
    }),
});

export const authRegisterSchema = z
  .object({
    username: z
      .string({ required_error: "El nombre de usuario es requerido" })
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      })
      .max(20, {
        message: "El nombre de usuario debe tener un máximo de 20 caracteres",
      }),
    email: z
      .string({ required_error: "El correo es requerido" })
      .email({ message: "El correo no es válido" }),
    password: z
      .string()
      .min(5, { message: "La contraseña debe tener al menos 5 caracteres" })
      .max(10, {
        message: "La contraseña debe tener un máximo de 10 caracteres",
      }),

    confirmPassword: z
      .string()
      .min(5, { message: "La contraseña debe tener al menos 5 caracteres" })
      .max(10, {
        message: "La contraseña debe tener un máximo de 10 caracteres",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const taskStatus = z.enum([
  "in progress",
  "done",
  "canceled",
  "backlog",
  "todo",
]);
export const taskSchema = z.object({
  _id: z.string(),
  title: z.string({
    required_error: "El título es requerido",
  }),
  status: taskStatus,
  description: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "El título es requerido",
  }),
  status: taskStatus,
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  _id: z.string(),
  title: z.string({
    required_error: "El título es requerido",
  }),
  status: taskStatus,
  description: z.string().optional(),
});

export const deleteTaskSchema = z.object({
  _id: z.string(),
  text: z.string(),
});

import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(5, {
      message: "Password must be at least 5 characters",
    }),
  confirmPassword: z
    .string({
      required_error: "confirmPassword is required",
    })
    .min(5, {
      message: "Password must be at least 5 characters",
    }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

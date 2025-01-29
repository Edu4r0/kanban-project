import axios from "axios";
import { authRegisterSchema, authSchema } from "@/lib/shemas";
import { z } from "zod";

export const registerRequest = async (
  data: z.infer<typeof authRegisterSchema>
) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};

export const loginRequest = async (data: z.infer<typeof authSchema>) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};

export const verifyTokenRequest = async (token: string) => {
  const response = await axios.get("/api/auth/verify-token", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

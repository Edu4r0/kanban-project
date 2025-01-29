import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
} from "@/lib/querys/auth";
import Cookies from "js-cookie";
import { z } from "zod";
import { authRegisterSchema, authSchema } from "@/lib/shemas";
import { useNavigate } from "react-router-dom";
import { AUTH_URL, DEFAULT_CALLBACK_URL } from "@/config/index";
import type { AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | null>(null); // Specify the context type

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signup = async (
    user: z.infer<typeof authRegisterSchema>,
    callbackURL?: string
  ) => {
    try {
      const res = await registerRequest(user);

      setUser(res.data);
      setIsAuthenticated(true);

      navigate(callbackURL ?? AUTH_URL);

      return { success: true, message: "Registro exitoso" };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error?.response?.data?.message || "An error occurred",
        };
      }
      return { success: false, message: "Error inesperado" };

      //console.log(error.response.data);
      //setErrors(error.response.data.message);
    }
  };

  const signin = async (
    user: z.infer<typeof authSchema>,
    callbackURL?: string
  ) => {
    // Update return type
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      navigate(callbackURL ?? DEFAULT_CALLBACK_URL);
      return { success: true, message: "Sesión iniciada correctamente" };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error?.response?.data?.message || "An error occurred",
        };
      }
      return { success: false, message: "Error inesperado" };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate(AUTH_URL);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        if (!res) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

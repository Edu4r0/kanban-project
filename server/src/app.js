import { FRONTEND_URL } from "../config.js";
import authRoutes from "./routes/auth.route.js"; // El router de auth
import taskRoutes from "./routes/task.route.js"; // El router de tareas
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes); // Ruta para autentificación
app.use("/api", taskRoutes); // Ruta para tareas


if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html"));
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app;

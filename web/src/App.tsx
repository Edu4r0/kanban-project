import { Toaster } from "@pheralb/toast";
import NotFoundPage from "@/app/not-found";
import DashboardPage from "@/app/dashboard/page";
import DashboardLayout from "@/app/dashboard/layout";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-provider";
import AuthPage from "@/app/auth/page";
import AuthRegisterPage from "@/app/auth/register/page";
import { AuthProvider } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import Loading from "@/app/loading";
import { AUTH_URL, DEFAULT_CALLBACK_URL } from "./config";
import DashboardTasksPage from "@/app/dashboard/tasks/page";
import { TaskProvider } from "@/context/tasks-context";

export const ProtectedRoute = ({
  redirectWhenAuthenticated,
}: {
  redirectWhenAuthenticated?: boolean;
}) => {
  const { pathname } = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  // Redirigir si está autenticado y la ruta es pública
  if (
    isAuthenticated &&
    redirectWhenAuthenticated &&
    pathname !== "/auth/register"
  ) {
    return <Navigate to={DEFAULT_CALLBACK_URL} replace />;
  }

  // Redirigir si no está autenticado y la ruta es privada
  if (!isAuthenticated && !redirectWhenAuthenticated) {
    return <Navigate to={AUTH_URL} replace />;
  }

  // Mostrar el contenido protegido o público
  return <Outlet />;
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <ThemeProvider>
          <main>
            <Routes>
              {/* Rutas públicas */}
              <Route element={<ProtectedRoute redirectWhenAuthenticated />}>
                <Route path={AUTH_URL} element={<AuthPage />} />
                <Route path="/auth/register" element={<AuthRegisterPage />} />
              </Route>

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/dashboard/tasks"
                    element={<DashboardTasksPage />}
                  />
                </Route>
              </Route>

              {/* Ruta no encontrada */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster />
          </main>
        </ThemeProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

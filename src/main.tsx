import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Toaster richColors position="top-center" />

      <Routes>
        <Route index element={<App />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rotas Admin */}
        <Route
          path="/admin/*"
          element={
            <PublicRoute>
              <Dashboard />
            </PublicRoute>
          }
        />

        {/* Rotas User */}
        <Route
          path="/user/reservas"
          element={
            <UserRoute>
              <div>Minhas Reservas - Em Construção</div>
            </UserRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <UserRoute>
              <div>Profile - Em Construção</div>
            </UserRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

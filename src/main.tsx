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
import OwnerRoute from "./routes/OwnerRoute";
import UserRoute from "./routes/UserRoute";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import AdminConfig from "./pages/AdminConfig";
import AdminCourts from "./pages/AdminCourts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReservations from "./pages/AdminReservations";
import AdminSchedules from "./pages/AdminSchedules";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import Reservations from "./pages/Reservations";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerHome from "./pages/OwnerHome";
import OwnerArenas from "./pages/OwnerArenas";
import OwnerCourts from "./pages/OwnerCourts";
import OwnerSchedules from "./pages/OwnerSchedules";

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

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courts" element={<AdminCourts />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="config" element={<AdminConfig />} />
        </Route>

        <Route
          path="/owner"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        >
          <Route index element={<OwnerHome />} />
          <Route path="arenas" element={<OwnerArenas />} />
          <Route path="courts" element={<OwnerCourts />} />
          <Route path="schedules" element={<OwnerSchedules />} />
        </Route>

        <Route
          path="/user/reservations"
          element={
            <UserRoute>
              <Reservations />
            </UserRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <AuthenticatedRoute>
              <Profile />
            </AuthenticatedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);

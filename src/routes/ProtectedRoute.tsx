import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

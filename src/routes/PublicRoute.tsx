import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

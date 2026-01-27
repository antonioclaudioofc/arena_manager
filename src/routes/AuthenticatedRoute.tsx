import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-green-100">
        <Loader2 className="h-10 w-10 animate-spin text-green-700" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

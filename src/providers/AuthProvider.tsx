import { createContext, type ReactNode } from "react";
import type { User } from "../types/user";
import { useAuth } from "../hooks/use-auth";

interface AuthContextType {
  user: User | undefined;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

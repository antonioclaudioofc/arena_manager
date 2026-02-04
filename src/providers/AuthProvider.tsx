import { createContext, type ReactNode } from "react";
import type { User } from "../types/user";
import { useAuth as useAuthHook } from "../hooks/use-auth";

interface AuthContextType {
  user: User | undefined;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

// Re-export useAuth hook for convenience
export { useAuthHook as useAuth };

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

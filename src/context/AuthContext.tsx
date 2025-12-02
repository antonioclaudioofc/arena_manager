import { createContext, useState, useEffect, type ReactNode } from "react";
import { jwtVerify } from "jose";

interface UserPayload {
  sub: string;
  id: number;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

const SECRET = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState<UserPayload | null>(null);

  const loadUserFromToken = async (t: string) => {
    try {
      const { payload } = await jwtVerify(t, SECRET);

      if (!payload) throw new Error("No payload in token");

      const sub =
        typeof payload.sub === "string"
          ? payload.sub
          : String(payload.sub ?? "");

      const exp =
        typeof payload.exp === "number"
          ? payload.exp
          : typeof payload.exp === "string"
          ? parseInt(payload.exp, 10)
          : NaN;

      const id =
        typeof (payload as any).id === "number"
          ? (payload as any).id
          : typeof (payload as any).id === "string"
          ? parseInt((payload as any).id, 10)
          : undefined;

      const role =
        typeof (payload as any).role === "string"
          ? (payload as any).role
          : undefined;

      if (typeof id !== "number" || !role) {
        throw new Error("Missing required fields in token payload");
      }

      setUser({ sub, id, role, exp: Number(exp) });
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) loadUserFromToken(token);
  }, [token]);

  const login = (jwt: string) => {
    localStorage.setItem("access_token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

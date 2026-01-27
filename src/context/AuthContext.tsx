import { createContext, useState, useEffect, type ReactNode } from "react";

interface UserProfile {
  email: string;
  username: string;
  name: string;
  role: "admin" | "owner" | "client";
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchUserProfile = async (t: string) => {
    try {
      const res = await fetch(`${API_BASE}/user/me/`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (!res.ok) {
        throw new Error("Token inválido ou expirado");
      }

      const profile: UserProfile = await res.json();
      setUser(profile);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      logout();
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      await fetchUserProfile(token);
      setLoading(false);
    };

    init();
  }, [token]);

  const login = (jwt: string) => {
    localStorage.setItem("access_token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

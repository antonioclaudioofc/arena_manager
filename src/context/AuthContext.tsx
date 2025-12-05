import { createContext, useState, useEffect, type ReactNode } from "react";
import { jwtVerify } from "jose";

interface UserProfile {
  id: number;
  first_name: string;
  email: string;
  role: string;
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

const SECRET = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const validateToken = async (t: string) => {
    try {
      await jwtVerify(t, SECRET);
      return true;
    } catch (err) {
      console.error("Token inválido:", err);
      return false;
    }
  };

  const fetchUserProfile = async (t: string) => {
    try {
      const res = await fetch("http://localhost:8000/user", {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar perfil");

      const profile = await res.json();
      setUser(profile);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      logout();
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const init = async () => {
      const valid = await validateToken(token);

      if (!valid) {
        logout();
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

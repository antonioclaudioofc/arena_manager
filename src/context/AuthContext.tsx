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
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

const SECRET = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);

function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState<UserProfile | null>(null);

  const validateToken = async (t: string) => {
    try {
      await jwtVerify(t, SECRET);
      return true;
    } catch {
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
      logout();
    }
  };

  useEffect(() => {
    if (!token) return;

    (async () => {
      const valid = await validateToken(token);
      if (!valid) {
        logout();
        return;
      }
      await fetchUserProfile(token);
    })();
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
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

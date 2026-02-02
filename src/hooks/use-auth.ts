import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { decodeJwt } from "jose";
import { http } from "../api/http";
import { UserResponseSchema } from "../schemas/user.schemas";
import type { User, UserRegister } from "../types/user";

// ============================================================================
// API Functions
// ============================================================================

const getMe = async (): Promise<User> => {
  const { data } = await http.get("/user/me/");
  return UserResponseSchema.parse(data);
};

const login = async (
  username: string,
  password: string,
): Promise<{ access_token: string }> => {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const { data } = await http.post("/auth/login", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data;
};

const register = async (payload: UserRegister): Promise<any> => {
  const { data } = await http.post("/auth/register", payload);
  return data;
};

// ============================================================================
// Token helpers
// ============================================================================

const getValidToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const { exp } = decodeJwt(token);
    if (exp && exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      return null;
    }
  } catch {
    localStorage.removeItem("access_token");
    return null;
  }

  return token;
};

// ============================================================================
// React Query Hooks
// ============================================================================

export function useAuth() {
  const queryClient = useQueryClient();
  const token = getValidToken();

  const { data: user, isLoading, refetch, error } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });

  // Debug log para ver se há erro
  if (error) {
    console.error("[useAuth] Erro ao buscar usuário:", error);
  }

  const authLogin = async (jwt: string) => {
    localStorage.setItem("access_token", jwt);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    await refetch();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.setQueryData(["me"], null);
    queryClient.clear();
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    await refetch();
  };

  return {
    user,
    token,
    loading: isLoading,
    isAuthenticated: !!user,
    login: authLogin,
    logout,
    refreshUser,
  };
}

export function useLogin() {
  return useMutation<
    { access_token: string },
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password),
  });
}

export function useRegister() {
  return useMutation<any, Error, UserRegister>({
    mutationFn: (payload: UserRegister) => register(payload),
  });
}

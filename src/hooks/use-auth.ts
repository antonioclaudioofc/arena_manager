import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { decodeJwt } from "jose";
import { http } from "../api/http";
import { UserResponseSchema } from "../schemas/user.schemas";
import type { User, UserRegister } from "../types/user";
import { z } from "zod";

const TokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

// ============================================================================
// API Functions
// ============================================================================

const getMe = async (): Promise<User> => {
  const { data } = await http.get("/user/me/");
  return UserResponseSchema.parse(data);
};

const login = async (
  email: string,
  password: string,
): Promise<{ access_token: string; token_type: string }> => {
  const body = new URLSearchParams();
  // FastAPI OAuth2PasswordRequestForm expects the field name as "username".
  body.append("username", email);
  body.append("password", password);

  const { data } = await http.post("/auth/login", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return TokenSchema.parse(data);
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

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });

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
    { access_token: string; token_type: string },
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  });
}

export function useRegister() {
  return useMutation<any, Error, UserRegister>({
    mutationFn: (payload: UserRegister) => register(payload),
  });
}

export function isUnverifiedEmailError(error: unknown): boolean {
  const message =
    (error as any)?.response?.data?.message ||
    (error as any)?.response?.data?.detail ||
    (error as any)?.message ||
    "";

  const normalized = String(message)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return normalized.includes("email nao verificado");
}

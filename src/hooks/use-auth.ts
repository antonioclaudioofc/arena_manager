import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
// React Query Hooks
// ============================================================================

export function useAuth() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("access_token");

  const { data: user, isLoading, refetch } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });

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

  return {
    user,
    token,
    loading: isLoading,
    isAuthenticated: !!user,
    login: authLogin,
    logout,
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

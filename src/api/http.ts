import axios from "axios";
import { decodeJwt } from "jose";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

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

http.interceptors.request.use((config) => {
  const token = getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: any): string {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Erro inesperado"
  );
}

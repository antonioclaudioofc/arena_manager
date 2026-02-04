import type { User } from "../types/user";

export const isDemoClient = (user?: User | null) => {
  if (!user || user.role !== "client") return false;
  return (user.username ?? "").toLowerCase() === "client";
};

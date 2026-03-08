import type { User } from "../types/user";

export const isDemoClient = (user?: User | null) => {
  if (!user || user.role !== "player") return false;

  return user.email.toLowerCase() === "player@arena.demo";
};

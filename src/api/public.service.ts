import type { Arena } from "../types/arena";
import type { Court } from "../types/court";
import type { Schedule } from "../types/schedule";
import { http } from "./http";

export const publicService = {
  async listArenas(): Promise<Arena[]> {
    const { data } = await http.get("/public/arenas");
    return data;
  },

  async listCourtsByArena(arenaId: number): Promise<Court[]> {
    const { data } = await http.get(`/public/arenas/${arenaId}/courts`);
    return data;
  },

  async listSchedulesByCourt(courtId: number): Promise<Schedule[]> {
    const { data } = await http.get(`/public/courts/${courtId}/schedules`);
    return data;
  },
};

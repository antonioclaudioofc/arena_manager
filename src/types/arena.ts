import { z } from "zod";
import type {
  ArenaRequestSchema,
  ArenaResponseSchema,
  ArenaUpdateSchema,
} from "../schemas/arena.schemas";

export type ArenaRequest = z.infer<typeof ArenaRequestSchema>;
export type ArenaUpdate = z.infer<typeof ArenaUpdateSchema>;
export type Arena = z.infer<typeof ArenaResponseSchema>;

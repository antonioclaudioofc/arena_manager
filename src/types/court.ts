import type z from "zod";
import type {
  CourtRequestSchema,
  CourtResponseSchema,
  CourtUpdateSchema,
} from "../schemas/court.schemas";

export type CourtRequest = z.infer<typeof CourtRequestSchema>;
export type CourtUpdate = z.infer<typeof CourtUpdateSchema>;
export type Court = z.infer<typeof CourtResponseSchema>;

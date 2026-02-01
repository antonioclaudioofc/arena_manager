import { z } from "zod";

export const CourtBaseSchema = z.object({
  name: z.string().min(2).optional(),
  sports_type: z.string().min(2).optional(),
  price_per_hour: z.number().positive().optional(),
});

export const CourtRequestSchema = CourtBaseSchema.extend({
  arena_id: z.number(),
  name: z.string().min(2),
  sports_type: z.string().min(2),
  price_per_hour: z.number().positive(),
});

export const CourtUpdateSchema = CourtBaseSchema.partial();

export const CourtResponseSchema = z.object({
  id: z.number(),
  arena_id: z.number(),
  name: z.string(),
  sports_type: z.string(),
  price_per_hour: z.number(),
});

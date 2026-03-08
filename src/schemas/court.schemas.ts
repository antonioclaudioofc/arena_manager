import { z } from "zod";

const IdSchema = z.union([z.uuid(), z.number()]);

export const CourtBaseSchema = z.object({
  name: z.string().min(2).optional(),
  sport_type: z.string().min(2).optional(),
  surface_type: z.string().optional(),
  price_per_hour: z.coerce.number().positive().optional(),
  description: z.string().optional(),
});

export const CourtRequestSchema = CourtBaseSchema.extend({
  arena_id: IdSchema,
  name: z.string().min(2),
  sport_type: z.string().min(2).optional(),
  price_per_hour: z.coerce.number().positive(),
});

export const CourtUpdateSchema = CourtBaseSchema.partial();

export const CourtResponseSchema = z.object({
  id: IdSchema,
  slug: z.string().nullable().optional(),
  arena_id: IdSchema,
  name: z.string(),
  sport_type: z.string().optional(),
  surface_type: z.string().nullable().optional(),
  price_per_hour: z.coerce.number(),
  description: z.string().optional(),
});

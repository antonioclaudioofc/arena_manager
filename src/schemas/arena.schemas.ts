import z from "zod";

export const ArenaBaseSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
});

export const ArenaRequestSchema = ArenaBaseSchema.extend({
  name: z.string().min(2, "Campo obrigatório"),
  city: z.string().min(2, "Campo obrigatório"),
  address: z.string().min(2, "Campo obrigatório"),
});

export const ArenaUpdateSchema = ArenaBaseSchema.partial();

export const ArenaResponseSchema = z.object({
  id: z.number(),
  owner_id: z.number(),
  name: z.string(),
  city: z.string(),
  address: z.string(),
});

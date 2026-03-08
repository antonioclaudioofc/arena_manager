import z from "zod";

const IdSchema = z.union([z.uuid(), z.number()]);

export const ArenaBaseSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.email("E-mail inválido").optional(),
  city: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
  state: z.string().min(2).max(2).optional(),
  zip_code: z.string().optional(),
  opening_time: z.string().optional(),
  closing_time: z.string().optional(),
});

export const ArenaRequestSchema = ArenaBaseSchema.extend({
  name: z.string().min(2, "Campo obrigatório"),
  phone: z.string().min(8, "Campo obrigatório"),
  city: z.string().min(2, "Campo obrigatório"),
  address: z.string().min(2, "Campo obrigatório"),
  state: z.string().length(2, "UF deve ter 2 caracteres"),
  zip_code: z.string().min(8, "Campo obrigatório"),
});

export const ArenaUpdateSchema = ArenaBaseSchema.partial();

export const ArenaResponseSchema = z.object({
  id: IdSchema,
  owner_id: IdSchema,
  name: z.string(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  phone: z.string(),
  email: z.string().nullable().optional(),
  city: z.string(),
  address: z.string(),
  state: z.string(),
  zip_code: z.string(),
  opening_time: z.string().nullable().optional(),
  closing_time: z.string().nullable().optional(),
});

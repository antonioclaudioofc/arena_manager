import { z } from "zod";

export const ScheduleBaseSchema = z.object({
  date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

export const ScheduleRequestSchema = ScheduleBaseSchema.extend({
  court_id: z.number(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
});

export const ScheduleUpdateSchema = ScheduleBaseSchema.partial();

export const ScheduleResponseSchema = ScheduleBaseSchema.extend({
  id: z.number(),
  court_id: z.number(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
});

export const ScheduleWithAvailabilitySchema = ScheduleResponseSchema.extend({
  available: z.boolean(),
});

export const ScheduleWithCourtSchema = ScheduleResponseSchema.extend({
  court: z.object({
    id: z.number(),
    name: z.string(),
    sports_type: z.string().optional(),
  }),
});

export const ScheduleBatchRequestSchema = z.object({
  court_id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  interval_minutes: z.number().positive(),
  weekdays: z.array(z.number().min(0).max(6)),
});

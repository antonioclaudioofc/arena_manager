import type z from "zod";
import type {
  ScheduleRequestSchema,
  ScheduleUpdateSchema,
  ScheduleResponseSchema,
  ScheduleWithAvailabilitySchema,
  ScheduleWithCourtSchema,
  ScheduleBatchRequestSchema,
} from "../schemas/schedule.schemas";

export type ScheduleRequest = z.infer<typeof ScheduleRequestSchema>;
export type ScheduleUpdate = z.infer<typeof ScheduleUpdateSchema>;
export type Schedule = z.infer<typeof ScheduleResponseSchema>;
export type ScheduleWithAvailability = z.infer<
  typeof ScheduleWithAvailabilitySchema
>;
export type ScheduleBatchRequest = z.infer<typeof ScheduleBatchRequestSchema>;

export type ScheduleWithCourt = z.infer<typeof ScheduleWithCourtSchema>;

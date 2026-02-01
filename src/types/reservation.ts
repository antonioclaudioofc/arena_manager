import z from "zod";

export const ReservationSchema = z.object({
  id: z.number(),
  schedule_id: z.number().optional(),
});

export type Reservation = z.infer<typeof ReservationSchema>;

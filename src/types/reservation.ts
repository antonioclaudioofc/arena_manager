import z from "zod";

export const ReservationSchema = z.object({
  id: z.number(),
  schedule_id: z.number().optional(),
  status: z.string(),
  created_at: z.string(),
  schedule: z.object({
    id: z.number(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    court: z.object({
      id: z.number(),
      name: z.string(),
      sports_type: z.string().optional(),
    }),
  }).optional(),
});

export const AdminReservationSchema = z.object({
  id: z.number(),
  status: z.string(),
  created_at: z.string(),
  user: z.object({
    id: z.number(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
  }),
  schedule: z.object({
    id: z.number(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    court: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

export type Reservation = z.infer<typeof ReservationSchema>;
export type AdminReservation = z.infer<typeof AdminReservationSchema>;

import z from "zod";

export const ReservationSchema = z.object({
  id: z.uuid(),
  schedule_id: z.uuid().optional(),
  user_id: z.uuid().optional(),
  status: z.string(),
  created_at: z.string().optional(),
  cancelled_at: z.string().nullable().optional(),
  schedule: z
    .object({
      id: z.uuid(),
      date: z.string(),
      start_time: z.string(),
      end_time: z.string(),
      court: z
        .object({
          id: z.uuid(),
          name: z.string(),
          sport_type: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const AdminReservationSchema = z.object({
  id: z.uuid(),
  status: z.string(),
  created_at: z.string().optional(),
  cancelled_at: z.string().nullable().optional(),
  client: z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string(),
  }),
  arena: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  court: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  schedule: z.object({
    id: z.uuid(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
  }),
});

export type Reservation = z.infer<typeof ReservationSchema>;
export type AdminReservation = z.infer<typeof AdminReservationSchema>;

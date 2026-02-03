import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Reservation, AdminReservation } from "../types/reservation";

// ============================================================================
// API Functions
// ============================================================================

const getUserReservations = async (): Promise<Reservation[]> => {
  const { data } = await http.get("/reservations/me");
  return data;
};

const getOwnerReservations = async (): Promise<Reservation[]> => {
  const { data } = await http.get("/reservations/me");
  return data;
};

const deleteReservation = async (id: number): Promise<void> => {
  await http.delete(`/reservations/${id}`);
};

const createReservation = async (scheduleId: number): Promise<Reservation> => {
  const { data } = await http.post("/reservations/", {
    schedule_id: scheduleId,
  });
  return data;
};

const getAdminReservations = async (): Promise<AdminReservation[]> => {
  const { data } = await http.get("/admin/reservations");
  return data;
};

// ============================================================================
// React Query Hooks
// ============================================================================

export function useUserReservations(enabled: boolean = true) {
  return useQuery<Reservation[], Error>({
    queryKey: ["reservations"],
    queryFn: getUserReservations,
    enabled,
  });
}

export function useOwnerReservations(enabled: boolean = true) {
  return useQuery<Reservation[], Error>({
    queryKey: ["owner", "reservations"],
    queryFn: getOwnerReservations,
    enabled,
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation<Reservation, Error, number>({
    mutationFn: (scheduleId: number) => createReservation(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useAdminReservations(enabled: boolean = true) {
  return useQuery<AdminReservation[], Error>({
    queryKey: ["admin", "reservations"],
    queryFn: getAdminReservations,
    enabled,
  });
}

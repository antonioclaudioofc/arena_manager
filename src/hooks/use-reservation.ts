import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Reservation } from "../types/reservation";

// ============================================================================
// API Functions
// ============================================================================

const getUserReservations = async (): Promise<Reservation[]> => {
  const { data } = await http.get("/reservations/");
  return data;
};

const deleteReservation = async (id: number): Promise<void> => {
  await http.delete(`/reservations/${id}`);
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

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

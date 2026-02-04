import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { http } from "../api/http";
import type { Arena, ArenaRequest, ArenaUpdate } from "../types/arena";

// ============================================================================
// API Functions
// ============================================================================

const fetchArenas = async (): Promise<Arena[]> => {
  const { data } = await http.get("/arenas/");
  return data;
};

const createArena = async (
  payload: ArenaRequest,
): Promise<{ message: string }> => {
  const { data } = await http.post("/arenas/", payload);
  return data;
};

const updateArena = async (
  id: number,
  payload: ArenaUpdate,
): Promise<{ message: string }> => {
  const { data } = await http.put(`/arenas/${id}`, payload);
  return data;
};

const deleteArena = async (id: number): Promise<{ message: string }> => {
  const { data } = await http.delete(`/arenas/${id}`);
  return data;
};

// ============================================================================
// React Query Hooks
// ============================================================================

export function useArenas() {
  return useQuery<Arena[], Error>({
    queryKey: ["arenas"],
    queryFn: fetchArenas,
    retry: false,
  });
}

export function useCreateArena() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, ArenaRequest>({
    mutationFn: createArena,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Arena criada com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao criar arena";
      toast.error(message);
    },
  });
}

export function useUpdateArena() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { id: number; payload: ArenaUpdate }
  >({
    mutationFn: ({ id, payload }) => updateArena(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
      toast.success("Arena atualizada com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao atualizar arena";
      toast.error(message);
    },
  });
}

export function useDeleteArena() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: deleteArena,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
      toast.success("Arena deletada com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao deletar arena";
      toast.error(message);
    },
  });
}

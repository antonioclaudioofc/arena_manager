import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Arena } from "../types/arena";

// ============================================================================
// API Functions
// ============================================================================

const getOwnerArenas = async (): Promise<Arena[]> => {
  const { data } = await http.get("/arenas/");
  return data;
};

const updateOwnerArena = async (payload: any): Promise<Arena> => {
  if (payload.id) {
    const { data } = await http.put(`/arenas/${payload.id}`, payload);
    return data;
  }

  const { data } = await http.post(`/arenas/`, payload);
  return data;
};

const deleteOwnerArena = async (id: number): Promise<void> => {
  await http.delete(`/arenas/${id}`);
};

// ============================================================================
// React Query Hooks
// ============================================================================

export function useOwnerArenas() {
  return useQuery<Arena[], Error>({
    queryKey: ["owner", "arenas"],
    queryFn: getOwnerArenas,
  });
}

export function useUpdateOwnerArena() {
  const queryClient = useQueryClient();
  return useMutation<Arena, Error, any>({
    mutationFn: (payload: any) => updateOwnerArena(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "arenas"] });
    },
  });
}

export function useDeleteOwnerArena() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteOwnerArena(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "arenas"] });
    },
  });
}

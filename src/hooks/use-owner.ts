import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { http } from "../api/http";
import type { Arena } from "../types/arena";
import type { Court, CourtRequest, CourtUpdate } from "../types/court";
import { useMemo } from "react";

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

const getOwnerCourtsByArena = async (arenaId: number): Promise<Court[]> => {
  const { data } = await http.get(`/courts/${arenaId}`);
  return data;
};

const createOwnerCourt = async (payload: CourtRequest): Promise<Court> => {
  const { data } = await http.post("/courts/", payload);
  return data;
};

const updateOwnerCourt = async (
  id: number,
  payload: CourtUpdate,
): Promise<Court> => {
  const { data } = await http.put(`/courts/${id}`, payload);
  return data;
};

const deleteOwnerCourt = async (id: number): Promise<void> => {
  await http.delete(`/courts/${id}`);
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

export function useOwnerCourtsByArena(arenaId: number | null) {
  return useQuery<Court[], Error>({
    queryKey: ["owner", "courts", arenaId],
    queryFn: () => getOwnerCourtsByArena(arenaId!),
    enabled: !!arenaId,
  });
}

export function useOwnerCourtsByArenas(arenas: Arena[]) {
  const courtsQueries = useQueries({
    queries: (arenas || []).map((arena) => ({
      queryKey: ["owner", "courts", arena.id],
      queryFn: () => getOwnerCourtsByArena(arena.id),
      enabled: !!arena.id,
    })),
  });

  const courts = useMemo(() => {
    return courtsQueries.flatMap((q: any) => q.data || []);
  }, [courtsQueries]);

  const courtsByArenaId = useMemo(() => {
    const map: Record<number, Court[]> = {};
    arenas.forEach((arena) => {
      map[arena.id] = [];
    });
    courts.forEach((court) => {
      const arenaId = court.arena_id;
      if (!map[arenaId]) {
        map[arenaId] = [];
      }
      map[arenaId].push(court);
    });
    return map;
  }, [arenas, courts]);

  const isLoading = courtsQueries.some((q: any) => q.isLoading);
  const isError = courtsQueries.some((q: any) => q.isError);

  return {
    courts,
    courtsByArenaId,
    courtsQueries,
    isLoading,
    isError,
  };
}

export function useCreateOwnerCourt() {
  const queryClient = useQueryClient();
  return useMutation<Court, Error, CourtRequest>({
    mutationFn: (payload: CourtRequest) => createOwnerCourt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "courts"] });
    },
  });
}

export function useUpdateOwnerCourt() {
  const queryClient = useQueryClient();
  return useMutation<Court, Error, { id: number; payload: CourtUpdate }>({
    mutationFn: ({ id, payload }) => updateOwnerCourt(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "courts"] });
    },
  });
}

export function useDeleteOwnerCourt() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteOwnerCourt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "courts"] });
    },
  });
}

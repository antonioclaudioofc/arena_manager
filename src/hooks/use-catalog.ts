import { useQuery, useQueries } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Arena } from "../types/arena";
import type { Court } from "../types/court";
import type { Schedule } from "../types/schedule";
import { useMemo } from "react";
import dayjs from "dayjs";

// ===========================================================================
// API Functions
// ============================================================================

const getAllArenas = async (): Promise<Arena[]> => {
  const { data } = await http.get("/catalog/arenas");
  return data;
};

const getAllCourtsByArena = async (arenaId: number): Promise<Court[]> => {
  const { data } = await http.get(`/catalog/arenas/${arenaId}/courts`);
  return data;
};

const getAllSchedulesByCourt = async (courtId: number): Promise<Schedule[]> => {
  const { data } = await http.get(`/catalog/courts/${courtId}/schedules`);
  return data;
};

// ============================================================================
// React Query Hooks
// ============================================================================

export function useCatalogArenas() {
  return useQuery<Arena[], Error>({
    queryKey: ["arenas"],
    queryFn: getAllArenas,
  });
}
import type { ScheduleWithCourt } from "../types/schedule";

export function useCatalogCourtsByArena(arenaId: number | null) {
  return useQuery<Court[], Error>({
    queryKey: ["courts", arenaId],
    queryFn: () => getAllCourtsByArena(arenaId!),
    enabled: !!arenaId,
  });
}

export function useCatalogSchedulesByCourt(courtId: number | null) {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedules", courtId],
    queryFn: () => getAllSchedulesByCourt(courtId!),
    enabled: !!courtId,
  });
}

export function useCatalogSchedulesByCourts(
  courts: Court[],
  enabled: boolean = true,
) {
  const schedulesQueries = useQueries({
    queries: (courts || []).map((c) => ({
      queryKey: ["schedules", c.id],
      queryFn: () => getAllSchedulesByCourt(c.id),
      enabled,
    })),
  });

  const schedules = useMemo(() => {
    return schedulesQueries.flatMap((q: any) => q.data || []);
  }, [schedulesQueries]);

  const schedulesWithCourts = useMemo(() => {
    const courtsMap = new Map(courts.map((c) => [c.id, c]));
    return schedules.map((s) => {
      const court = courtsMap.get(s.court_id);
      return {
        ...s,
        court: court
          ? {
              id: court.id,
              name: court.name,
              sports_type: court.sports_type,
            }
          : { id: s.court_id, name: "N/A", sports_type: undefined },
      } as ScheduleWithCourt;
    });
  }, [schedules, courts]);

  return {
    schedules,
    schedulesQueries,
    schedulesWithCourts,
  };
}

// ============================================================================
// Derived State Hooks
// ============================================================================

export function useCatalogArenasFiltering(
  arenas: Arena[],
  searchQuery: string,
  selectedCity: string | null,
) {
  const filteredArenas = useMemo(() => {
    let filtered = arenas;

    if (searchQuery) {
      filtered = filtered.filter(
        (arena) =>
          arena.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          arena.city.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((arena) => arena.city === selectedCity);
    }

    return filtered;
  }, [searchQuery, selectedCity, arenas]);

  const cities = useMemo(() => {
    return Array.from(new Set(arenas.map((a) => a.city))).sort();
  }, [arenas]);

  return {
    filteredArenas,
    cities,
  };
}

export function useDatePills() {
  return useMemo(() => {
    const base = dayjs().startOf("day");

    return Array.from({ length: 7 }).map((_, i) => {
      const d = base.add(i, "day");
      return {
        label: `${d.format("DD")} ${d.format("ddd").toUpperCase()}`,
        iso: d.format("YYYY-MM-DD"),
      };
    });
  }, []);
}

export function useScheduleMapping(
  schedules: Schedule[],
  reservedScheduleIds: number[],
  selectedDateIndex: number,
  datePills: Array<{ iso: string; label: string }>,
) {
  return useMemo(() => {
    const map: Record<number, Schedule[]> = {};
    const selectedIso = datePills[selectedDateIndex]?.iso;

    if (!selectedIso) return map;

    schedules.forEach((s) => {
      if (s.date !== selectedIso) return;

      if (reservedScheduleIds.includes(s.id)) return;

      const courtId = s.court_id;
      if (!courtId) return;

      map[courtId] = map[courtId] || [];
      map[courtId].push(s);
    });

    return map;
  }, [schedules, selectedDateIndex, datePills, reservedScheduleIds]);
}

import { useState, useEffect } from "react";
import { Building2, Trophy, CalendarDays } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useArenas } from "../hooks/use-arena";
import { http } from "../api/http";
import { capitalizeWords } from "../utils/capitalizeWords";
import type { Court } from "../types/court";
import type { Schedule } from "../types/schedule";

export default function OwnerHome() {
  const { data: arenas = [], isLoading } = useArenas();
  const [stats, setStats] = useState({
    totalArenas: 0,
    totalCourts: 0,
    totalSchedules: 0,
  });

  const courtsQueries = useQueries({
    queries: (arenas || []).map((arena) => ({
      queryKey: ["courts", arena.id],
      queryFn: async () => {
        const { data } = await http.get<Court[]>(`/courts/${arena.id}`);
        return data;
      },
    })),
  });

  const schedulesQueries = useQueries({
    queries: (courtsQueries || [])
      .flatMap((query: any) => query.data || [])
      .map((court: Court) => ({
        queryKey: ["schedules", court.id],
        queryFn: async () => {
          const { data } = await http.get<Schedule[]>(
            `/catalog/courts/${court.id}/schedules`,
          );
          return data;
        },
      })),
  });

  useEffect(() => {
    const totalCourts = courtsQueries.reduce((sum, query: any) => {
      return sum + (query.data?.length || 0);
    }, 0);

    const totalSchedules = schedulesQueries.reduce((sum, query: any) => {
      return sum + (query.data?.length || 0);
    }, 0);

    setStats((prev) => ({
      ...prev,
      totalArenas: arenas.length,
      totalCourts,
      totalSchedules,
    }));
  }, [arenas, courtsQueries, schedulesQueries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Bem-vindo ao seu Painel
        </h2>
        <p className="text-gray-600 mt-2">
          Gerencie suas arenas, quadras e horários
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Arenas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalArenas}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Quadras</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalCourts}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Horários
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalSchedules}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CalendarDays className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Minhas Arenas</h3>
          {arenas.length > 0 && (
            <div className="flex justify-center">
              <a
                href="/owner/arenas"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Gerenciar Arenas
              </a>
            </div>
          )}
        </div>

        {arenas.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              Você ainda não possui arenas cadastradas
            </p>
            <a
              href="/owner/arenas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Criar Primeira Arena
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Arena
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cidade
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Quadras
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {arenas.map((arena) => (
                  <tr
                    key={arena.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Building2 className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {capitalizeWords(arena.name)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {capitalizeWords(arena.city)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {capitalizeWords(arena.address)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="bg-blue-50 px-3 py-1 rounded-full">
                          <span className="text-sm font-semibold text-blue-600">
                            {courtsQueries[
                              arenas.findIndex((a) => a.id === arena.id)
                            ]?.data?.length || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

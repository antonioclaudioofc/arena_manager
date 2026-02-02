import {
  Building2,
  Trophy,
  CalendarDays,
  MapPin,
  ArrowRight,
  Users,
} from "lucide-react";
import { useOwnerArenas, useOwnerCourtsByArenas } from "../hooks/use-owner";
import { useCatalogSchedulesByCourts } from "../hooks/use-catalog";
import { useOwnerReservations } from "../hooks/use-reservation";
import type { Arena } from "../types/arena";
import { capitalizeWords } from "../utils/capitalizeWords";

export default function OwnerHome() {
  const {
    data: arenasData,
    isLoading: arenasLoading,
    isError: arenasError,
    refetch: refetchArenas,
  } = useOwnerArenas();

  const arenas: Arena[] = arenasData ?? [];

  const {
    courts,
    courtsByArenaId,
    isLoading: courtsLoading,
    isError: courtsError,
    courtsQueries,
  } = useOwnerCourtsByArenas(arenas);

  const { schedules, schedulesQueries } = useCatalogSchedulesByCourts(
    courts,
    courts.length > 0,
  );

  const { data: reservations = [], isLoading: reservationsLoading } =
    useOwnerReservations(true);

  const schedulesLoading = schedulesQueries.some((q: any) => q.isLoading);
  const schedulesError = schedulesQueries.some((q: any) => q.isError);

  const isLoading =
    arenasLoading || courtsLoading || schedulesLoading || reservationsLoading;
  const hasError = arenasError || courtsError || schedulesError;

  const stats = {
    totalArenas: arenas.length,
    totalCourts: courts.length,
    totalSchedules: schedules.length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-700 text-lg font-medium">
          Não foi possível carregar o seu painel agora.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Tente novamente em alguns instantes.
        </p>
        <button
          onClick={() => {
            refetchArenas();
            courtsQueries.forEach((q: any) => q.refetch && q.refetch());
            schedulesQueries.forEach((q: any) => q.refetch && q.refetch());
          }}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Tentar novamente
          <ArrowRight className="h-4 w-4" />
        </button>
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

      {courts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Minhas Quadras
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {courts.slice(0, 6).map((court) => (
              <div
                key={court.id}
                className="border border-gray-200 rounded-lg p-3 hover:border-blue-600 transition-colors"
              >
                <p className="font-medium text-gray-900">
                  {capitalizeWords(court.name)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {capitalizeWords(court.sports_type)}
                </p>
                <p className="text-sm text-green-700 font-semibold mt-2">
                  R$ {Number(court.price_per_hour).toFixed(2)}/h
                </p>
              </div>
            ))}
          </div>
          {courts.length > 6 && (
            <p className="text-sm text-gray-500 mt-4">
              +{courts.length - 6} quadras
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Minhas Arenas
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.totalArenas} {stats.totalArenas === 1 ? "arena" : "arenas"}{" "}
              • {stats.totalCourts}{" "}
              {stats.totalCourts === 1 ? "quadra" : "quadras"}
            </p>
          </div>
          <a
            href="/owner/arenas"
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            Gerenciar <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {arenas.length === 0 ? (
          <div className="text-center py-12">
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
          <div className="grid grid-cols-1 gap-3">
            {arenas.map((arena) => {
              const arenaCourts = courtsByArenaId[arena.id] || [];
              return (
                <div
                  key={arena.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900">
                        {capitalizeWords(arena.name)}
                      </h4>
                      <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span>{capitalizeWords(arena.city)}</span>
                        </div>
                        <p className="text-gray-500 hidden md:block">•</p>
                        <span className="text-gray-500">
                          {capitalizeWords(arena.address)}
                        </span>
                        <p className="text-gray-500 hidden md:block">•</p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {arenaCourts.length}{" "}
                          {arenaCourts.length === 1 ? "quadra" : "quadras"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reservations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Reservas Recentes
              </h3>
            </div>
            <a
              href="/owner/reservations"
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {reservations.length}{" "}
            {reservations.length === 1 ? "pessoa agendou" : "pessoas agendaram"}{" "}
            um horário em suas arenas
          </p>
        </div>
      )}
    </div>
  );
}

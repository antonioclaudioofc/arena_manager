import { useState, useContext } from "react";
import {
  useCatalogArenas,
  useCatalogCourtsByArena,
  useCatalogSchedulesByCourts,
  useCatalogArenasFiltering,
  useDatePills,
} from "../hooks/use-catalog";
import { useUserReservations } from "../hooks/use-reservation";
import CourtList from "../components/CourtList";
import { useNavigate } from "react-router";
import {
  Building2,
  MapPin,
  Star,
  ChevronDown,
  Search,
  X,
  Lightbulb,
  MapPinned,
} from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { capitalizeWords } from "../utils/capitalizeWords";
import { AuthContext } from "../providers/AuthProvider";
import type { Arena } from "../types/arena";

dayjs.locale("pt-br");

export default function Home() {
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);
  const [arenaView, setArenaView] = useState<"list" | "detail">("list");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const { data: arenas = [] } = useCatalogArenas();

  const { token, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { filteredArenas, cities } = useCatalogArenasFiltering(
    arenas,
    searchQuery,
    selectedCity,
  );

  const { refetch: refetchReservations } = useUserReservations(!!token);

  const { data: courts = [], refetch: refetchCourts } = useCatalogCourtsByArena(
    selectedArena?.id || null,
  );

  const { schedulesWithCourts, schedulesQueries } = useCatalogSchedulesByCourts(
    courts as any[],
    !!selectedArena,
  );

  const enrichedScheduleMap = schedulesWithCourts.reduce(
    (acc: Record<number, any[]>, schedule) => {
      if (!acc[schedule.court_id]) acc[schedule.court_id] = [];
      acc[schedule.court_id].push(schedule);
      return acc;
    },
    {},
  );

  const datePills = useDatePills();

  const refetchData = () => {
    schedulesQueries.forEach((q: any) => q.refetch && q.refetch());
    refetchReservations && refetchReservations();
    refetchCourts && refetchCourts();
  };

  const handleSelectArena = (arena: Arena) => {
    setSelectedArena(arena);
    setArenaView("detail");
    setSelectedDateIndex(0);
  };

  const handleBackToList = () => {
    setArenaView("list");
    setSelectedArena(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {!selectedArena && (
        <div className="p-4 md:p-6 pb-8 md:pb-12 pt-8 md:pt-12 bg-linear-to-b from-white to-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-10">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900">
                Encontre sua Arena Perfeita
              </h1>
              <p className="text-base md:text-xl text-gray-500">
                Descubra as melhores arenas esportivas próximas a você
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6 md:mb-8 shadow-lg">
                <Search
                  size={24}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10"
                />
                <Input
                  type="text"
                  placeholder="Buscar arena ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-16 py-7 text-lg rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 transition hover:opacity-60 text-gray-500 z-10"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {cities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3 text-center text-gray-900">
                    Filtrar por Arena:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => setSelectedCity(null)}
                      className={`filter-tag ${!selectedCity ? "active" : ""}`}
                    >
                      <MapPinned size={16} className="inline mr-1" />
                      Todos
                    </button>
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`filter-tag ${selectedCity === city ? "active" : ""}`}
                      >
                        {capitalizeWords(city)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {arenaView === "list" ? (
            <div className="space-y-6">
              {filteredArenas.length === 0 ? (
                <div className="card text-center p-8 md:p-16">
                  <Building2 className="mx-auto mb-4 opacity-40 text-gray-500 w-14 h-14" />
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                    Nenhuma arena encontrada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedCity
                      ? "Tente alterar seus filtros de busca"
                      : "Não há arenas cadastradas no momento"}
                  </p>
                  {!searchQuery && !selectedCity && (
                    <button
                      onClick={() => setSelectedCity(null)}
                      className="px-6 py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    >
                      Voltar para Todas as Cidades
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {filteredArenas.length} Arena
                      {filteredArenas.length !== 1 ? "s" : ""} encontrada
                      {filteredArenas.length !== 1 ? "s" : ""}
                    </h2>
                  </div>
                  <div className="arena-grid">
                    {filteredArenas.map((arena) => (
                      <div
                        key={arena.id}
                        onClick={() => handleSelectArena(arena)}
                        className="card card-clickable group overflow-hidden relative"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity  from-emerald-600 to-emerald-500"></div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm bg-emerald-100">
                              <Building2 className="text-emerald-600 w-7 h-7" />
                            </div>
                            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                              <Star
                                className="text-amber-500 w-4 h-4"
                                fill="currentColor"
                              />
                              <span className="text-sm font-bold text-amber-500">
                                4.5
                              </span>
                            </div>
                          </div>

                          <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors text-gray-900">
                            {capitalizeWords(arena.name)}
                          </h3>

                          <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2">
                              <MapPin className="text-emerald-600 w-4 h-4" />
                              <p className="text-sm font-semibold text-gray-500">
                                {capitalizeWords(arena.city)}
                              </p>
                            </div>
                            <p className="text-xs leading-relaxed pl-6 text-gray-500">
                              {capitalizeWords(arena.address)}
                            </p>
                          </div>

                          <Button className="w-full flex items-center justify-center gap-2">
                            Ver horários
                            <ChevronDown size={18} className="-rotate-90" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : selectedArena ? (
            <div className="space-y-6 pt-6">
              <div className="card">
                <button
                  onClick={handleBackToList}
                  className="flex items-center cursor-pointer gap-2 text-sm font-semibold mb-6 transition text-emerald-600 hover:text-emerald-700"
                >
                  <ChevronDown className="rotate-90 h-5 w-5" />
                  Voltar para arenas
                </button>

                <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
                  <div className="p-4 rounded-lg shrink-0 bg-emerald-100">
                    <Building2 className="text-emerald-600 w-8 h-8" />
                  </div>
                  <div className="flex-1 w-full">
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                      {capitalizeWords(selectedArena.name)}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-emerald-600 w-4 h-4" />
                        <span className="font-semibold text-gray-500">
                          {capitalizeWords(selectedArena.city)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
                        <Star
                          className="text-amber-500 w-4 h-6"
                          fill="currentColor"
                        />
                        <span className="font-bold text-amber-500">4.5</span>
                        <span className="text-sm text-gray-500">
                          (120 avaliações)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm bg-gray-50 p-3 rounded-lg flex items-center gap-2 text-gray-500">
                  <MapPin className="text-emerald-600 w-4 h-4" />
                  {capitalizeWords(selectedArena.address)}
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Selecione a data
                </h3>
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                  {datePills.map((d, i) => (
                    <button
                      key={d.iso}
                      onClick={() => setSelectedDateIndex(i)}
                      className={`px-3 md:px-4 py-3 rounded-lg border-2 transition shrink-0 cursor-pointer ${
                        i === selectedDateIndex
                          ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      <div className="text-xs font-bold">
                        {dayjs(d.iso).format("ddd").toUpperCase()}
                      </div>
                      <div className="text-lg font-bold">
                        {dayjs(d.iso).format("DD")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {courts.length === 0 ? (
                <div className="card text-center p-8 md:p-12">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Nenhuma quadra disponível
                  </h3>
                  <p className="text-gray-500">
                    Esta arena ainda não possui quadras cadastradas
                  </p>
                </div>
              ) : (
                <div>
                  <CourtList
                    courts={courts}
                    scheduleMap={enrichedScheduleMap}
                    onReservationSuccess={refetchData}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {(!user || user?.role === "client") && arenaView === "list" && (
        <div className="p-4 md:p-8 mt-8 md:mt-12 bg-emerald-50 border-t-2 border-emerald-600">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-lg shrink-0 bg-emerald-600">
                  <Lightbulb size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 text-emerald-800">
                    Você é dono de uma arena?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cadastre-se como proprietário e comece a gerenciar suas
                    quadras de forma profissional
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  if (!user) {
                    navigate("/register");
                  } else if (user.role === "client") {
                    navigate("/become-owner");
                  } else {
                    navigate("/owner");
                  }
                }}
                variant="default"
                className="w-full md:w-auto flex items-center gap-2 whitespace-nowrap"
              >
                <Building2 size={20} />
                {!user
                  ? "Criar Arena"
                  : user.role === "client"
                    ? "Cadastrar Arena"
                    : "Gerenciar Arenas"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { useContext, useEffect, useState } from "react";
import { Building2, Trophy, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../providers/AuthProvider";

interface Arena {
  id: number;
  name: string;
  city: string;
  address: string;
}

export default function OwnerHome() {
  const { token } = useContext(AuthContext);
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [stats, setStats] = useState({
    totalArenas: 0,
    totalCourts: 0,
    totalSchedules: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/arenas/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArenas(data);
          setStats((prev) => ({ ...prev, totalArenas: data.length }));

          // Buscar quadras de todas as arenas
          let totalCourts = 0;
          for (const arena of data) {
            const courtsResponse = await fetch(
              `${API_BASE}/courts/${arena.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (courtsResponse.ok) {
              const courts = await courtsResponse.json();
              totalCourts += courts.length;
            }
          }
          setStats((prev) => ({ ...prev, totalCourts }));
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, API_BASE]);

  if (loading) {
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

      {/* Cards de estatísticas */}
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
              <p className="text-gray-600 text-sm font-medium">
                Total Quadras
              </p>
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

      {/* Lista de arenas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Minhas Arenas
        </h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arenas.map((arena) => (
              <div
                key={arena.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-600 transition-colors"
              >
                <h4 className="font-semibold text-lg text-gray-900">
                  {arena.name}
                </h4>
                <p className="text-gray-600 text-sm mt-1">{arena.city}</p>
                <p className="text-gray-500 text-sm">{arena.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState, useEffect, useContext, useCallback } from "react";
import CourtList from "../components/CourtList";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Settings } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function Home() {
  const [courts, setCourts] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [reservedScheduleIds, setReservedScheduleIds] = useState<number[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const { token, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchReservedSchedules = useCallback(async () => {
    if (!token) {
      setReservedScheduleIds([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reservations/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setReservedScheduleIds([]);
        return;
      }

      const reservations = await response.json();
      const ids = reservations.map((r: any) => r.schedule?.id).filter(Boolean);
      setReservedScheduleIds(ids);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      setReservedScheduleIds([]);
    }
  }, [token, API_BASE]);

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/schedules/`);
      if (!response.ok) throw new Error("Erro ao buscar horários");

      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      toast.error("Erro ao carregar horários");
    }
  }, [API_BASE]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/courts/`);
        if (!response.ok) throw new Error("Erro ao buscar quadras");

        const data = await response.json();
        setCourts(data);

        await fetchSchedules();
        await fetchReservedSchedules();
      } catch (err) {
        toast.error("Erro ao carregar dados");
      }
    };

    fetchData();
  }, [fetchSchedules, fetchReservedSchedules, API_BASE]);

  const datePills = useMemo(() => {
    const base = dayjs().startOf("day");

    return Array.from({ length: 7 }).map((_, i) => {
      const d = base.add(i, "day");
      return {
        label: `${d.format("DD")} ${d.format("ddd").toUpperCase()}`,
        iso: d.format("YYYY-MM-DD"),
      };
    });
  }, []);

  const scheduleMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    const selectedIso = datePills[selectedDateIndex]?.iso;

    if (!selectedIso) return map;

    schedules.forEach((s) => {
      if (s.date !== selectedIso) return;

      const isAvailable = s.available && !reservedScheduleIds.includes(s.id);
      if (!isAvailable) return;

      const courtId = s.court?.id ?? s.court_id;
      if (!courtId) return;

      map[courtId] = map[courtId] || [];
      map[courtId].push(s);
    });

    return map;
  }, [schedules, selectedDateIndex, datePills, reservedScheduleIds]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="bg-white rounded-md shadow p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Agende seu Horário</h2>
            <p className="text-sm text-gray-600 mt-1">
              {dayjs().format("MMMM YYYY")}
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Settings size={20} />
              Dashboard
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-3 overflow-x-auto flex-wrap">
          {datePills.map((d, i) => (
            <button
              key={d.iso}
              onClick={() => setSelectedDateIndex(i)}
              className={`w-16 h-16 rounded-full border flex flex-col items-center justify-center transition cursor-pointer hover:bg-gray-300 ${
                i === selectedDateIndex
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-xs">
                {dayjs(d.iso).format("ddd").toUpperCase()}
              </span>
              <span className="text-sm font-semibold">
                {dayjs(d.iso).format("DD")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <CourtList
          courts={courts}
          scheduleMap={scheduleMap}
          onReservationSuccess={() => {
            fetchSchedules();
            fetchReservedSchedules();
          }}
        />
      </div>
    </section>
  );
}

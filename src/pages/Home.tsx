import { useMemo, useState, useEffect, useContext, useCallback } from "react";
import CourtList from "../components/CourtList";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [courts, setCourts] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [reservedScheduleIds, setReservedScheduleIds] = useState<number[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const { token } = useContext(AuthContext);

  const fetchReservedSchedules = useCallback(async () => {
    if (!token) {
      setReservedScheduleIds([]);
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/reservation/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const reservations = await response.json();
        const scheduleIds = reservations.map((r: any) => r.schedule_id);
        setReservedScheduleIds(scheduleIds);
      } else {
        setReservedScheduleIds([]);
      }
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      setReservedScheduleIds([]);
    }
  }, [token]);

  const fetchSchedules = useCallback(async () => {
    try {
      const schedulesResponse = await fetch(
        `http://localhost:8000/schedule/?t=${Date.now()}`
      );
      if (!schedulesResponse.ok) throw new Error("Erro ao buscar horários");
      const schedulesData = await schedulesResponse.json();
      setSchedules(schedulesData);
    } catch (err) {
      console.error("Erro ao carregar horários:", err);
      toast.error("Erro ao carregar horários");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courtsResponse = await fetch("http://localhost:8000/");
        if (!courtsResponse.ok) throw new Error("Erro ao buscar quadras");
        const courtsData = await courtsResponse.json();
        setCourts(courtsData);

        await fetchSchedules();
        await fetchReservedSchedules();
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar quadras ou horários");
      }
    };

    fetchData();
  }, [fetchSchedules, fetchReservedSchedules]);

  // build a simple list of 7 dates starting from today
  const datePills = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0); // Reset time to start of day
    const arr = [] as { label: string; iso: string }[];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const day = d.getDate().toString().padStart(2, "0");
      const weekday = d
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .toUpperCase();
      arr.push({
        label: `${day} ${weekday}`,
        iso: d.toISOString().slice(0, 10),
      });
    }
    return arr;
  }, []);

  // only show schedules for selected date and grouped by court
  const scheduleMap = useMemo(() => {
    const map: Record<number, typeof schedules> = {};
    const selectedIso = datePills[selectedDateIndex].iso;
    console.log("Filtrando schedules para data:", selectedIso);
    console.log("Schedules disponíveis:", schedules);
    schedules.forEach((s) => {
      console.log(`Schedule ${s.id}: date="${s.date}", matches=${s.date === selectedIso}`);
      if (s.date !== selectedIso) return;
      // Marcar como indisponível se já tem reserva
      const schedule = {
        ...s,
        available: s.available && !reservedScheduleIds.includes(s.id),
      };
      map[s.court_id] = map[s.court_id] || [];
      map[s.court_id].push(schedule);
    });
    return map;
  }, [schedules, selectedDateIndex, datePills, reservedScheduleIds]);

  return (
    <section>
      <div className="bg-white rounded-md shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold text-center">
          Agende seu Horário
        </h2>
        <p className="text-sm text-center text-gray-600 mt-1">
          Novembro/Dezembro 2025
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 overflow-x-auto py-2">
          {datePills.map((d, i) => (
            <button
              key={d.iso}
              onClick={() => setSelectedDateIndex(i)}
              style={
                i === selectedDateIndex
                  ? { backgroundColor: "var(--brand-600)" }
                  : undefined
              }
              className={`w-16 h-16 flex flex-col items-center justify-center rounded-full border transition-all cursor-pointer hover:bg-white ${
                i === selectedDateIndex
                  ? "text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-xs">
                {new Date(d.iso)
                  .toLocaleDateString("pt-BR", { weekday: "short" })
                  .toUpperCase()}
              </span>
              <span className="text-sm font-semibold">
                {new Date(d.iso).getDate().toString().padStart(2, "0")}
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

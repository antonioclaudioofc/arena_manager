import { useMemo, useState, useContext } from "react";
import CourtList from "../components/CourtList";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const courts = [
    {
      id: 1,
      name: "Arena Prime",
      sports_type: "Futebol",
      description: "Quadra principal",
    },
    {
      id: 2,
      name: "Quadra B",
      sports_type: "Futebol Society",
      description: "Coberta",
    },
  ];

  const schedules = [
    {
      id: 1,
      date: "2025-12-01",
      start_time: "16:00",
      end_time: "17:00",
      available: true,
      court_id: 1,
    },
    {
      id: 2,
      date: "2025-12-01",
      start_time: "17:00",
      end_time: "18:00",
      available: true,
      court_id: 1,
    },
    {
      id: 3,
      date: "2025-12-01",
      start_time: "18:00",
      end_time: "19:00",
      available: false,
      court_id: 1,
    },
    {
      id: 4,
      date: "2025-12-01",
      start_time: "19:00",
      end_time: "20:00",
      available: true,
      court_id: 1,
    },
    {
      id: 5,
      date: "2025-12-01",
      start_time: "20:00",
      end_time: "22:00",
      available: false,
      court_id: 1,
    },
    {
      id: 6,
      date: "2025-12-01",
      start_time: "10:00",
      end_time: "11:00",
      available: true,
      court_id: 2,
    },
  ];

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const auth = useContext(AuthContext);
  const token = auth?.token || localStorage.getItem("access_token");

  console.log("Auth token:", token);

  // build a simple list of 7 dates starting from the first schedule date
  const datePills = useMemo(() => {
    const base = new Date("2025-12-01");
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
    schedules.forEach((s) => {
      if (s.date !== selectedIso) return;
      map[s.court_id] = map[s.court_id] || [];
      map[s.court_id].push(s);
    });
    return map;
  }, [schedules, selectedDateIndex, datePills]);

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
        {token ? (
          <div className="bg-gray-50 p-4 rounded-md text-sm break-all">
            <strong>Token:</strong>
            <div className="mt-2 font-mono text-xs text-gray-700">{token}</div>
          </div>
        ) : null}
        <CourtList courts={courts} scheduleMap={scheduleMap} />
      </div>
    </section>
  );
}

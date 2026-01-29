import { capitalizeWords } from "../utils/capitalizeWords";
import ScheduleCard from "./ScheduleCard";

export default function CourtList({
  courts,
  scheduleMap,
  onReservationSuccess,
}: {
  courts: {
    id: number;
    name: string;
    sports_type?: string;
    description?: string;
    price_per_hour?: number;
  }[];
  scheduleMap: Record<
    number,
    {
      id: number;
      date: string;
      start_time: string;
      end_time: string;
      is_available?: boolean;
      court_id: number;
    }[]
  >;
  onReservationSuccess?: () => void;
}) {
  return (
    <div className="space-y-6">
      {courts.map((court) => {
        const schedules = scheduleMap[court.id] || [];
        return (
          <div key={court.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-md bg-gray-800" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {capitalizeWords(court.name)}
                </h3>
                {court.sports_type && (
                  <div
                    style={{ color: "var(--brand-600)" }}
                    className="text-sm font-medium"
                  >
                    {capitalizeWords(court.sports_type)}
                  </div>
                )}
                {court.price_per_hour && (
                  <div className="text-sm text-gray-700 font-semibold mt-1">
                    R$ {court.price_per_hour.toFixed(2)}/hora
                  </div>
                )}
                {court.description && (
                  <p className="text-sm text-gray-500">{court.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {schedules.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Nenhum horário disponível
                </div>
              ) : (
                schedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onReservationSuccess={onReservationSuccess}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

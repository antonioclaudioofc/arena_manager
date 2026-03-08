import { useNavigate } from "react-router";
import { capitalizeWords } from "../utils/capitalizeWords";
import { DollarSign, MapPin } from "lucide-react";
import type { Court } from "../types/court";
import type { ScheduleWithCourt } from "../types/schedule";

const formatPrice = (value: unknown) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return null;
  return numericValue.toFixed(2);
};

export default function CourtList({
  courts,
  scheduleMap,
  reservedScheduleIds = [],
  arenaInfo,
}: {
  courts: Court[];
  scheduleMap: Record<string | number, ScheduleWithCourt[]>;
  reservedScheduleIds?: Array<string | number>;
  arenaInfo?: { name?: string; address?: string };
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-start">
      {courts.map((court) => {
        const schedules = scheduleMap[court.id] || [];
        const sportLabel = court.sport_type
          ? capitalizeWords(court.sport_type)
          : "Quadra Esportiva";

        return (
          <div
            key={court.id}
            className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative h-32 md:h-36">
              <img
                src="/court-card-cover.svg"
                alt={`Imagem de capa da quadra ${court.name}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent" />
              <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800">
                {sportLabel}
              </span>
            </div>

            <div className="bg-gray-50 p-4 md:p-5">
              <h3 className="mb-3 text-lg md:text-xl leading-tight font-bold text-slate-900">
                {capitalizeWords(court.name)}
                {court.sport_type ? ` - ${sportLabel}` : ""}
              </h3>

              {arenaInfo?.name && (
                <div className="mb-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-slate-500" />
                    <div>
                      <p className="text-base md:text-lg font-semibold text-slate-900">
                        {capitalizeWords(arenaInfo.name)}
                      </p>
                      {arenaInfo.address && (
                        <p className="text-sm md:text-base text-slate-500">
                          {capitalizeWords(arenaInfo.address)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {formatPrice(court.price_per_hour) && (
                <div className="mb-4 flex items-center gap-2.5">
                  <DollarSign className="h-5 w-5 text-slate-700" />
                  <p className="text-xl md:text-2xl font-bold text-slate-900">
                    R$ {formatPrice(court.price_per_hour)}/hora
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  navigate("/court-booking", {
                    state: {
                      court,
                      schedules,
                      reservedScheduleIds,
                      arenaInfo,
                    },
                  });
                }}
                className="mb-3 w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-base md:text-lg font-bold text-white transition hover:bg-emerald-700 cursor-pointer"
              >
                Reservar Horário
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

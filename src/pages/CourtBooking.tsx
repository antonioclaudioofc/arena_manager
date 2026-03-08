import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Calendar, Check, ChevronLeft, Clock3, LogIn } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AuthContext } from "../providers/AuthProvider";
import { useCreateReservation } from "../hooks/use-reservation";
import { Button } from "../components/Button";
import { capitalizeWords } from "../utils/capitalizeWords";
import type { Court } from "../types/court";
import type { ScheduleWithCourt } from "../types/schedule";

dayjs.locale("pt-br");

type BookingState = {
  court?: Court;
  schedules?: ScheduleWithCourt[];
  reservedScheduleIds?: Array<string | number>;
  arenaInfo?: { name?: string; address?: string };
};

const formatDateKey = (date: string) => date.split("T")[0];

const formatDateLabels = (dateIso: string) => {
  const date = dayjs(dateIso);
  return {
    weekday: date.format("dddd").replace("-feira", "").toLowerCase(),
    day: date.format("DD"),
    full: date.format("DD [de] MMMM"),
  };
};

const formatHourRange = (startTime: string, endTime: string) => {
  const start = Number(startTime.split(":")[0]);
  const end = Number(endTime.split(":")[0]);

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return `${startTime} - ${endTime}`;
  }

  return `${start}h - ${end}h`;
};

export default function CourtBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { mutate: createReservation, isPending } = useCreateReservation();

  const bookingState = (location.state as BookingState | null) ?? null;
  const court = bookingState?.court;
  const schedules = bookingState?.schedules ?? [];
  const reservedScheduleIds = bookingState?.reservedScheduleIds ?? [];

  const nextSevenDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        dayjs().add(index, "day").format("YYYY-MM-DD"),
      ),
    [],
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(
    nextSevenDays[0] ?? null,
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<
    string | number | null
  >(null);

  const schedulesForDate = useMemo(() => {
    if (!selectedDate) return [];
    return schedules
      .filter((schedule) => formatDateKey(schedule.date) === selectedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [schedules, selectedDate]);

  const selectedSchedule = schedulesForDate.find(
    (schedule) => schedule.id === selectedScheduleId,
  );

  const handleReserve = () => {
    if (!selectedSchedule) return;

    createReservation(selectedSchedule.id, {
      onSuccess: () => {
        toast.success("Reserva realizada com sucesso!");
        navigate(-1);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Erro ao fazer reserva");
      },
    });
  };

  if (!court) {
    return (
      <section className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reserva de quadra
          </h1>
          <p className="text-gray-600 mb-5">
            Não foi possível carregar os dados da reserva. Volte e selecione uma
            quadra novamente.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para quadras
        </button>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src="/court-card-cover.svg"
              alt={`Capa da quadra ${court.name}`}
              className="h-24 w-24 rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {capitalizeWords(court.name)}
                {court.sport_type
                  ? ` - ${capitalizeWords(court.sport_type)}`
                  : ""}
              </h2>
              {bookingState?.arenaInfo?.name && (
                <p className="mt-1 text-lg font-medium text-gray-800">
                  {capitalizeWords(bookingState.arenaInfo.name)}
                </p>
              )}
              {bookingState?.arenaInfo?.address && (
                <p className="text-gray-500">
                  {capitalizeWords(bookingState.arenaInfo.address)}
                </p>
              )}
            </div>
          </div>
        </div>

        {!user && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6 text-blue-900">
            <div className="flex items-start gap-3">
              <LogIn className="h-5 w-5 mt-0.5" />
              <div>
                <p className="text-xl font-semibold">
                  Faça login para reservar
                </p>
                <p className="text-blue-800">
                  Você precisa estar logado para confirmar uma reserva. Explore
                  os horários e faça login quando estiver pronto.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-2 underline font-semibold cursor-pointer"
                >
                  Fazer login agora
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-3xl font-bold text-gray-900">
                <Calendar className="h-5 w-5 text-orange-500" />
                Selecione a Data
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {nextSevenDays.map((dateIso) => {
                  const label = formatDateLabels(dateIso);
                  const isActive = selectedDate === dateIso;

                  return (
                    <button
                      key={dateIso}
                      type="button"
                      onClick={() => {
                        setSelectedDate(dateIso);
                        setSelectedScheduleId(null);
                      }}
                      className={`rounded-2xl px-3 py-4 text-center transition cursor-pointer ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      <div className="text-sm font-semibold capitalize">
                        {label.weekday}
                      </div>
                      <div className="text-4xl font-bold">{label.day}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-3xl font-bold text-gray-900">
                <Clock3 className="h-5 w-5 text-orange-500" />
                Selecione o Horário
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {schedulesForDate.length === 0 ? (
                  <p className="col-span-full text-gray-500">
                    Nenhum horário disponível nesta data.
                  </p>
                ) : (
                  schedulesForDate.map((schedule) => {
                    const isReserved = reservedScheduleIds.includes(
                      schedule.id,
                    );
                    const isActive = selectedScheduleId === schedule.id;

                    return (
                      <button
                        key={schedule.id}
                        type="button"
                        disabled={isReserved}
                        onClick={() => setSelectedScheduleId(schedule.id)}
                        className={`rounded-xl px-3 py-3 text-center font-semibold transition border ${
                          isReserved
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                            : isActive
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-900 hover:border-emerald-300"
                        }`}
                      >
                        {formatHourRange(
                          schedule.start_time,
                          schedule.end_time,
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm xl:sticky xl:top-28">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Resumo da Reserva
            </h3>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Quadra</span>
                <span className="font-semibold text-gray-900 text-right">
                  {capitalizeWords(court.name)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Data</span>
                <span className="font-semibold text-gray-900">
                  {selectedDate ? formatDateLabels(selectedDate).full : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Horário</span>
                <span className="font-semibold text-gray-900">
                  {selectedSchedule
                    ? formatHourRange(
                        selectedSchedule.start_time,
                        selectedSchedule.end_time,
                      )
                    : "-"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              disabled={!user || !selectedSchedule || isPending}
              onClick={handleReserve}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
            >
              <Check className="h-5 w-5" />
              {isPending ? "Confirmando..." : "Confirmar Reserva"}
            </Button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Você pode cancelar gratuitamente até 2 horas antes do horário.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

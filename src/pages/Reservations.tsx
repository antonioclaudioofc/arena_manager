import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/Dialog";
import { Button } from "../components/Button";
import {
  ArrowLeft,
  MoveLeft,
  X,
  CalendarDays,
  Clock3,
  MapPin,
  DollarSign,
} from "lucide-react";
import logo from "../assets/logo.svg";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  useUserReservations,
  useDeleteReservation,
} from "../hooks/use-reservation";
import { useCatalogArenas } from "../hooks/use-catalog";
import { useAuth } from "../providers/AuthProvider";
import { capitalizeWords } from "../utils/capitalizeWords";

dayjs.locale("pt-br");

export default function Reservations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: reservations = [], isLoading } = useUserReservations();
  const { data: catalogArenas = [] } = useCatalogArenas();
  const { mutate: deleteReservation } = useDeleteReservation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(
    null,
  );

  const canCancelReservations = user?.role === "player";

  const arenaNameById = useMemo(() => {
    const map = new Map<string, string>();
    catalogArenas.forEach((arena) => {
      map.set(String(arena.id), arena.name);
    });
    return map;
  }, [catalogArenas]);

  const safeCapitalize = (value?: string) => {
    if (!value) return "-";
    return capitalizeWords(value);
  };

  const extractArenaName = (reservation: any) => {
    const directName =
      reservation.arena?.name ||
      reservation.arena_name ||
      reservation.schedule?.arena?.name ||
      reservation.schedule?.court?.arena?.name ||
      reservation.schedule?.court?.arena_name ||
      reservation.court?.arena_name;

    if (directName) return String(directName);

    const arenaId =
      reservation.arena_id ||
      reservation.schedule?.arena_id ||
      reservation.schedule?.court?.arena_id ||
      reservation.court?.arena_id;

    if (arenaId !== undefined && arenaId !== null) {
      return arenaNameById.get(String(arenaId));
    }

    return undefined;
  };

  const extractTotalValue = (reservation: any) => {
    const candidates = [
      reservation.total_amount,
      reservation.total_price,
      reservation.total,
      reservation.amount,
      reservation.price,
      reservation.schedule?.price_per_hour,
      reservation.schedule?.court?.price_per_hour,
      reservation.court?.price_per_hour,
    ];

    for (const candidate of candidates) {
      const numeric = Number(candidate);
      if (Number.isFinite(numeric) && numeric > 0) {
        return numeric;
      }
    }

    return null;
  };

  const handleConfirmDelete = () => {
    if (!reservationToDelete) return;

    deleteReservation(reservationToDelete, {
      onSuccess: () => {
        toast.success("Reserva cancelada com sucesso!");
        setDeleteDialogOpen(false);
        setReservationToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Erro ao cancelar reserva");
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      active: {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        label: "Confirmada",
      },
      cancelled: {
        bg: "bg-rose-100",
        text: "text-red-800",
        label: "Cancelada",
      },
      finished: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Concluída",
      },
      cancel_requested: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        label: "Cancelamento Solicitado",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-lg bg-white border-b border-gray-200 translate-y-0">
        <div className="max-w-7xl p-6 mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 transition hover:opacity-80 cursor-pointer"
            >
              <ArrowLeft className="" />
              <img src={logo} alt="Arena Manager" className="w-12 h-12" />
              <div className="hidden sm:block">
                <h2 className="font-bold text-lg text-emerald-600">
                  Arena Manager
                </h2>
                <p className="text-xs text-gray-500">
                  Sua plataforma esportiva
                </p>
              </div>
            </button>
            <div className="text-green-700 text-2xl font-medium">Histórico</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 mt-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 md:mb-8 font-semibold text-2xl cursor-pointer transition hover:opacity-70 text-emerald-600"
        >
          <MoveLeft className="w-6 h-6" />
          <span>Voltar</span>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === "player"
                ? "Você ainda não tem reservas. Explore as arenas disponíveis e faça sua primeira reserva!"
                : "Você não possui reservas antigas."}
            </p>
            {user?.role === "player" && (
              <Button onClick={() => navigate("/")}>Explorar Arenas</Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {user?.role !== "player" && (
              <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-6 py-3">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Estas são reservas que você fez antes
                  de se tornar proprietário de arena. Você não pode mais
                  cancelar ou modificar essas reservas.
                </p>
              </div>
            )}
            {reservations.map((reservation: any) => {
              const courtName = safeCapitalize(
                reservation.schedule?.court?.name,
              );
              const reservationDate = reservation.schedule?.date
                ? dayjs(reservation.schedule.date)
                : null;
              const timeRange =
                reservation.schedule?.start_time &&
                reservation.schedule?.end_time
                  ? `${reservation.schedule.start_time} - ${reservation.schedule.end_time}`
                  : "Horário não disponível";
              const totalValue = extractTotalValue(reservation);
              const paymentMethod = reservation.payment_method
                ? String(reservation.payment_method).toUpperCase()
                : "PIX";
              const arenaName = extractArenaName(reservation);

              return (
                <article
                  key={reservation.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <img
                      src="/court-card-cover.svg"
                      alt={`Imagem da reserva da quadra ${courtName}`}
                      className="h-24 w-24 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">
                        {courtName}
                      </h3>
                      <div className="mt-2">
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span>
                            {reservationDate
                              ? reservationDate.format("DD [de] MMMM [de] YYYY")
                              : "Data não disponível"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-gray-500" />
                          <span>{timeRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{safeCapitalize(arenaName)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>{paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right md:min-w-[140px]">
                      <p className="text-gray-500 text-sm">Total</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {totalValue !== null
                          ? `R$ ${totalValue.toFixed(2).replace(".", ",")}`
                          : "A definir"}
                      </p>

                      {canCancelReservations &&
                        reservation.status === "active" && (
                          <button
                            onClick={() => {
                              setReservationToDelete(reservation.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="mt-4 ml-auto text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer transition-colors font-medium"
                          >
                            <X size={16} />
                            Cancelar
                          </button>
                        )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteDialogOpen(false);
                setReservationToDelete(null);
              }}
            >
              Não
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Sim, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

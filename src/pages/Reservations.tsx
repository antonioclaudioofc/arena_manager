import { useState } from "react";
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
import { ArrowLeft, MoveLeft, X } from "lucide-react";
import logo from "../assets/logo.svg";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  useUserReservations,
  useDeleteReservation,
} from "../hooks/use-reservation";
import { useAuth } from "../providers/AuthProvider";

dayjs.locale("pt-br");

export default function Reservations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: reservations = [], isLoading } = useUserReservations();
  const { mutate: deleteReservation } = useDeleteReservation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null,
  );

  // Owner/admin não pode cancelar suas reservas antigas
  const canCancelReservations = user?.role === "client";

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
      active: { bg: "bg-green-100", text: "text-green-800", label: "Ativa" },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Cancelada",
      },
      finished: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Finalizada",
      },
      cancel_requested: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
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
            <div className="text-green-700 text-2xl font-medium">
              Minhas Reservas
            </div>
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
              {user?.role === "client"
                ? "Você ainda não tem reservas. Explore as arenas disponíveis e faça sua primeira reserva!"
                : "Você não possui reservas antigas."}
            </p>
            {user?.role === "client" && (
              <Button onClick={() => navigate("/")}>Explorar Arenas</Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {user?.role !== "client" && (
              <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Estas são reservas que você fez antes de se
                  tornar proprietário de arena. Você não pode mais cancelar ou
                  modificar essas reservas.
                </p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quadra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation: any) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.schedule?.court?.name || "N/A"}
                        </div>
                        {reservation.schedule?.court?.sports_type && (
                          <div className="text-sm text-gray-500">
                            {reservation.schedule.court.sports_type}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {dayjs(reservation.schedule?.date).format(
                            "DD/MM/YYYY",
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dayjs(reservation.schedule?.date).format("dddd")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.schedule?.start_time} -{" "}
                        {reservation.schedule?.end_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(reservation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {canCancelReservations &&
                          reservation.status === "active" && (
                            <button
                              onClick={() => {
                                setReservationToDelete(reservation.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer transition-colors font-medium"
                            >
                              <X size={16} />
                              Cancelar
                            </button>
                          )}
                        {!canCancelReservations && (
                          <span className="text-gray-400 text-xs">
                            Não disponível
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

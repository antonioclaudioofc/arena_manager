import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/Dialog";
import { Button } from "../components/Button";
import { X } from "lucide-react";

interface Reservation {
  id: number;
  owner_id: number;
  schedule_id: number;
  status: string;
  created_at: string;
  schedule?: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    available: boolean;
    court_id: number;
    court_name?: string;
  };
}

export default function Profile() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );
  const { token, user } = useContext(AuthContext);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/reservation/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar reservas");
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setReservationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservationToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/reservation/${reservationToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cancelar reserva");
      }

      toast.success("Reserva cancelada com sucesso!");
      fetchReservations();
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
    } catch (err: any) {
      console.error("Erro ao cancelar reserva:", err);
      toast.error(err.message || "Erro ao cancelar reserva");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        {user && (
          <div className="mt-4 bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.first_name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Minhas Reservas
          </h2>
        </div>

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
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      Carregando reservas...
                    </div>
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Você ainda não tem nenhuma reserva
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.schedule?.court_name ||
                        `Quadra ${reservation.schedule?.court_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.schedule?.date
                        ? new Date(
                            reservation.schedule.date
                          ).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.schedule?.start_time &&
                      reservation.schedule?.end_time
                        ? `${reservation.schedule.start_time} às ${reservation.schedule.end_time}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reservation.status === "Agendado"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "Ocupado"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {reservation.status !== "Ocupado" && (
                        <button
                          onClick={() => handleDeleteClick(reservation.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <X size={16} />
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog de Confirmação de Cancelamento */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setReservationToDelete(null);
              }}
            >
              Não, manter
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Sim, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

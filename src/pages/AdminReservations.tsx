import { useEffect, useState, useContext } from "react";
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

interface AdminReservation {
  id: number;
  status: string;
  created_at: string;

  user: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
  };

  schedule: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    court: {
      id: number;
      name: string;
    };
  };
}

export default function AdminReservations() {
  const { token } = useContext(AuthContext);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );

  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/admin/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao buscar reservas");

        return;
      }

      setReservations(data);
    } catch (err) {
      console.error(err);
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
        `${API_BASE}/reservations/${reservationToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao excluir reserva");

        return;
      }

      toast.success(data.message || "Reserva excluída com sucesso!");
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
      fetchReservations();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao excluir reserva");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Reservas</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quadra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Horário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Carregando reservas...
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Nenhuma reserva encontrada
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{reservation.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {reservation.user.first_name || reservation.user.last_name
                      ? `${reservation.user.first_name ?? ""} ${
                          reservation.user.last_name ?? ""
                        }`.trim()
                      : reservation.user.username ||
                        reservation.user.email ||
                        `Usuário ${reservation.user.id}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {reservation.schedule.court.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(reservation.schedule.date).toLocaleDateString(
                      "pt-BR"
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {reservation.schedule.start_time} às{" "}
                    {reservation.schedule.end_time}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reservation.status === "Agendado"
                          ? "bg-yellow-100 text-yellow-800"
                          : reservation.status === "Ocupado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(reservation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta reserva? Esta ação não pode
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
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

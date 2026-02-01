import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getErrorMessage } from "../api/http";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/Dialog";
import { Button } from "../components/Button";
import { ArrowLeft, X } from "lucide-react";
import logo from "../assets/logo.svg";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface Reservation {
  id: number;
  status: string;
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

export default function Reservations() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );

  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/reservations/`, {
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
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
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
        toast.error(data.message || "Erro ao cancelar reserva");

        return;
      }

      toast.success(data.message || "Reserva cancelada com sucesso!");
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
      fetchReservations();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-green-700 to-green-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 max-md:p-0 hover:bg-green-600 rounded-lg text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <img src={logo} alt="Logo" className="h-12" />
          </div>
          <h1 className="text-2xl font-bold text-white max-md:text-lg">
            Minhas Reservas
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">
                  Quadra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    Carregando reservas...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    Você ainda não tem reservas
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4">{r.schedule.court.name}</td>
                    <td className="px-6 py-4">
                      {dayjs(r.schedule.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4">
                      {r.schedule.start_time} às {r.schedule.end_time}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setReservationToDelete(r.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 flex items-center gap-1 cursor-pointer transition-color hover:text-red-800"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta reserva?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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

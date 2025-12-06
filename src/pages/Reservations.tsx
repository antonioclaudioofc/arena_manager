import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
import { ArrowLeft, X } from "lucide-react";
import logo from "../assets/logo.svg";

interface Reservation {
  id: number;
  owner_id: number;
  schedule_id: number;
  status: string;
  created_at: string;
}

interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  court_id: number;
}

interface Court {
  id: number;
  name: string;
  sports_type?: string;
}

export default function Reservations() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [schedulesMap, setSchedulesMap] = useState<Record<number, Schedule>>(
    {}
  );
  const [courtsMap, setCourtsMap] = useState<Record<number, Court>>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, schedulesRes, courtsRes] = await Promise.all([
        fetch("http://localhost:8000/user/reservations/?t=" + Date.now(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8000/schedule/?t=" + Date.now()),
        fetch("http://localhost:8000/"),
      ]);

      if (!reservationsRes.ok) {
        throw new Error("Erro ao buscar reservas");
      }
      if (!schedulesRes.ok) {
        throw new Error("Erro ao buscar horários");
      }
      if (!courtsRes.ok) {
        throw new Error("Erro ao buscar quadras");
      }

      const [reservationsData, schedulesData, courtsData] = await Promise.all([
        reservationsRes.json(),
        schedulesRes.json(),
        courtsRes.json(),
      ]);

      const scheduleIndex = (schedulesData as Schedule[]).reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {} as Record<number, Schedule>);

      const courtIndex = (courtsData as Court[]).reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {} as Record<number, Court>);

      setSchedulesMap(scheduleIndex);
      setCourtsMap(courtIndex);
      setReservations(reservationsData as Reservation[]);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
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
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
      fetchData();
    } catch (err: any) {
      console.error("Erro ao cancelar reserva:", err);
      toast.error(err.message || "Erro ao cancelar reserva");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-green-700 to-green-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-green-600 rounded-lg transition-colors text-white cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft size={24} />
            </button>
            <a
              href="/"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="Logo" className="h-12 w-auto" />
            </a>
          </div>
          <h1 className="text-2xl font-bold text-white">Minhas Reservas</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Card Reservas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                        {(() => {
                          const schedule =
                            schedulesMap[reservation.schedule_id];
                          if (!schedule)
                            return `Quadra ${reservation.schedule_id}`;
                          const court = courtsMap[schedule.court_id];
                          return court?.name || `Quadra ${schedule.court_id}`;
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const schedule =
                            schedulesMap[reservation.schedule_id];
                          if (schedule?.date)
                            return new Date(schedule.date).toLocaleDateString(
                              "pt-BR"
                            );
                          return "-";
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const schedule =
                            schedulesMap[reservation.schedule_id];
                          if (schedule?.start_time && schedule?.end_time)
                            return `${schedule.start_time} às ${schedule.end_time}`;
                          return "-";
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClick(reservation.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
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

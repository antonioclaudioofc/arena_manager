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

interface Reservation {
  id: number;
  owner_id: number;
  status: string;
  created_at: string;
  updated_at?: string | null;
  schedule_id: number;
}

interface UserProfile {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
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
  description?: string;
}

export default function AdminReservations() {
  const { token } = useContext(AuthContext);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<number, UserProfile>>({});
  const [schedulesMap, setSchedulesMap] = useState<Record<number, Schedule>>(
    {}
  );
  const [courtsMap, setCourtsMap] = useState<Record<number, Court>>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );

  const loadUsersForReservations = async (items: Reservation[]) => {
    const ids = Array.from(new Set(items.map((r) => r.owner_id))).filter(
      Boolean
    );

    await Promise.all(
      ids.map(async (id) => {
        if (users[id]) return users[id];
        if (!token) return null;

        try {
          const res = await fetch(`http://localhost:8000/admin/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("Erro ao buscar usuário");

          const data = (await res.json()) as UserProfile;
          setUsers((prev) => ({ ...prev, [id]: data }));
          return data;
        } catch (err) {
          console.error(`Erro ao buscar usuário ${id}:`, err);
          return null;
        }
      })
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, schedulesRes, courtsRes] = await Promise.all([
        fetch(`http://localhost:8000/reservation/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`http://localhost:8000/schedule/`),
        fetch(`http://localhost:8000/`),
      ]);

      if (!reservationsRes.ok) throw new Error("Erro ao buscar reservas");
      if (!schedulesRes.ok) throw new Error("Erro ao buscar horários");
      if (!courtsRes.ok) throw new Error("Erro ao buscar quadras");

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
      await loadUsersForReservations(reservationsData as Reservation[]);
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
        throw new Error("Erro ao excluir reserva");
      }

      toast.success("Reserva excluída com sucesso!");
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
      fetchData();
    } catch (err: any) {
      console.error("Erro ao excluir reserva:", err);
      toast.error(err.message || "Erro ao excluir reserva");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Reservas</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
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
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    Carregando reservas...
                  </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{reservation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      const user = users[reservation.owner_id];
                      const fullName = `${user?.first_name ?? ""} ${
                        user?.last_name ?? ""
                      }`.trim();
                      if (fullName) return fullName;
                      if (user?.username) return user.username;
                      return `Usuário ${reservation.owner_id}`;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      const schedule = schedulesMap[reservation.schedule_id];
                      if (!schedule) return `Quadra ${reservation.schedule_id}`;
                      const court = courtsMap[schedule.court_id];
                      return court?.name || `Quadra ${schedule.court_id}`;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      const schedule = schedulesMap[reservation.schedule_id];
                      if (schedule?.date)
                        return new Date(schedule.date).toLocaleDateString(
                          "pt-BR"
                        );
                      if (reservation.created_at)
                        return new Date(
                          reservation.created_at
                        ).toLocaleDateString("pt-BR");
                      return "-";
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      const schedule = schedulesMap[reservation.schedule_id];
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

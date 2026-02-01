import { useState, useContext } from "react";
import { toast } from "sonner";
import { AuthContext } from "../providers/AuthProvider";
import { getErrorMessage } from "../api/http";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./Dialog";
import { Button } from "./Button";

export default function ScheduleCard({
  schedule,
  onReservationSuccess,
}: {
  schedule: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_available?: boolean;
    court_id: number;
  };
  onReservationSuccess?: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleReserve = async () => {
    if (!token) {
      toast.error("Você precisa estar logado para fazer uma reserva");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/reservations/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schedule_id: schedule.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao fazer reserva");

        return;
      }

      toast.success(data.message || "Reserva realizada com sucesso!");
      setDialogOpen(false);
      onReservationSuccess?.();
    } catch (err: any) {
      console.error("Erro ao fazer reserva:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => schedule.is_available && setDialogOpen(true)}
        className={`flex items-center gap-3 p-3 rounded-lg shadow-sm bg-white hover:bg-gray-50 ${
          schedule.is_available
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-60"
        }`}
      >
        <div
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            schedule.is_available ? "chip-is_available" : "chip-occupied"
          }`}
        >
          <div className="text-sm">
            {schedule.start_time} às {schedule.end_time}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {schedule.is_available ? (
            <span
              style={{ color: "var(--brand-600)" }}
              className="font-semibold"
            >
              Disponível
            </span>
          ) : (
            <span>Ocupado</span>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              Você está prestes a reservar o horário de{" "}
              <strong>
                {schedule.start_time} às {schedule.end_time}
              </strong>
              . Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleReserve} disabled={isLoading}>
              {isLoading ? "Reservando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

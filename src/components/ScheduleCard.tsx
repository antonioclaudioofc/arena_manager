import { useState } from "react";
import { toast } from "sonner";
import { useCreateReservation } from "../hooks/use-reservation";
import type { ScheduleWithCourt } from "../types/schedule";
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
  schedule: ScheduleWithCourt;
  onReservationSuccess?: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: createReservation, isPending } = useCreateReservation();

  const handleReserve = () => {
    createReservation(schedule.id, {
      onSuccess: () => {
        toast.success("Reserva realizada com sucesso!");
        setDialogOpen(false);
        onReservationSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Erro ao fazer reserva"
        );
      },
    });
  };

  return (
    <>
      <div
        onClick={() => setDialogOpen(true)}
        className={`flex items-center gap-3 p-3 rounded-lg shadow-sm bg-white hover:bg-gray-50 cursor-pointer`}
      >
        <div
          className={`px-3 py-2 rounded-md text-sm font-medium chip-is_available`}
        >
          <div className="text-sm">
            {schedule.start_time} às {schedule.end_time}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span
            style={{ color: "var(--brand-600)" }}
            className="font-semibold"
          >
            Disponível
          </span>
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
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleReserve}
              disabled={isPending}
            >
              {isPending ? "Reservando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useEffect, useState } from "react";
import { CalendarDays, Pencil, Trash2, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "../api/http";
import { Button } from "../components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import {
  useOwnerArenas,
  useOwnerCourtsByArena,
  useOwnerSchedulesByCourt,
  useCreateOwnerSchedule,
  useUpdateOwnerSchedule,
  useDeleteOwnerSchedule,
  useBatchOwnerSchedules,
} from "../hooks/use-owner";
import { capitalizeWords } from "../utils/capitalizeWords";
import type { Schedule } from "../types/schedule";

export default function OwnerSchedules() {
  const { data: arenas = [], isLoading: arenasLoading } = useOwnerArenas();
  const [selectedArena, setSelectedArena] = useState<number | null>(null);
  const { data: courts = [], isLoading: courtsLoading } =
    useOwnerCourtsByArena(selectedArena);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const { data: schedules = [], isLoading: schedulesLoading } =
    useOwnerSchedulesByCourt(selectedCourt);
  const [formArenaId, setFormArenaId] = useState<number | null>(null);
  const [formCourtId, setFormCourtId] = useState<number | null>(null);
  const { data: formCourts = [] } = useOwnerCourtsByArena(formArenaId);

  const createSchedule = useCreateOwnerSchedule();
  const updateSchedule = useUpdateOwnerSchedule();
  const deleteSchedule = useDeleteOwnerSchedule();
  const batchSchedules = useBatchOwnerSchedules();

  const loading = arenasLoading || courtsLoading || schedulesLoading;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });
  const [batchFormData, setBatchFormData] = useState({
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    interval_minutes: "60",
    weekdays: [] as number[],
  });

  const weekdayLabels = [
    { value: 0, label: "Segunda" },
    { value: 1, label: "Terça" },
    { value: 2, label: "Quarta" },
    { value: 3, label: "Quinta" },
    { value: 4, label: "Sexta" },
    { value: 5, label: "Sábado" },
    { value: 6, label: "Domingo" },
  ];



  useEffect(() => {
    if (!selectedArena && arenas.length > 0) {
      setSelectedArena(arenas[0].id);
    }
  }, [arenas, selectedArena]);

  useEffect(() => {
    if (!selectedArena) return;

    if (courts.length > 0) {
      setSelectedCourt((prev) => prev ?? courts[0].id);
    } else {
      setSelectedCourt(null);
    }
  }, [selectedArena, courts]);

  useEffect(() => {
    if (!formArenaId && arenas.length > 0) {
      setFormArenaId(arenas[0].id);
    }
  }, [arenas, formArenaId]);

  useEffect(() => {
    if (!formArenaId) return;

    if (formCourts.length > 0) {
      setFormCourtId((prev) =>
        formCourts.some((court) => court.id === prev) ? prev : formCourts[0].id,
      );
    } else {
      setFormCourtId(null);
    }
  }, [formArenaId, formCourts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.start_time || !formData.end_time) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (!formCourtId) {
      toast.error("Selecione uma quadra");
      return;
    }

    try {
      if (editingSchedule) {
        await updateSchedule.mutateAsync({
          id: editingSchedule.id,
          payload: formData,
        });
        toast.success("Horário atualizado com sucesso");
        handleCloseDialog();
      } else {
        await createSchedule.mutateAsync({
          court_id: formCourtId,
          ...formData,
        });
        toast.success("Horário criado com sucesso");
        handleCloseDialog();
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !batchFormData.start_date ||
      !batchFormData.end_date ||
      !batchFormData.start_time ||
      !batchFormData.end_time ||
      !batchFormData.interval_minutes
    ) {
      toast.error("Todos os campos principais são obrigatórios");
      return;
    }

    if (!formCourtId) {
      toast.error("Selecione uma quadra");
      return;
    }

    try {
      const payload = {
        court_id: formCourtId,
        start_date: batchFormData.start_date,
        end_date: batchFormData.end_date,
        start_time: batchFormData.start_time,
        end_time: batchFormData.end_time,
        interval_minutes: parseInt(batchFormData.interval_minutes),
        weekdays: batchFormData.weekdays,
      };

      await batchSchedules.mutateAsync(payload);
      toast.success("Horários criados em lote com sucesso");
      handleCloseBatchDialog();
    } catch (err) {
      console.error("Erro:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (scheduleId: number) => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este horário? Reservas associadas serão removidas.",
      )
    ) {
      return;
    }

    try {
      await deleteSchedule.mutateAsync(scheduleId);
      toast.success("Horário deletado com sucesso");
    } catch (err) {
      console.error("Erro:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      date: schedule.date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });
    setFormArenaId(selectedArena ?? arenas[0]?.id ?? null);
    setFormCourtId(selectedCourt ?? null);
    setDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingSchedule(null);
    setFormData({ date: "", start_time: "", end_time: "" });
    setFormArenaId(selectedArena ?? arenas[0]?.id ?? null);
    setFormCourtId(selectedCourt ?? null);
    setDialogOpen(true);
  };

  const handleOpenBatchDialog = () => {
    setFormArenaId(selectedArena ?? arenas[0]?.id ?? null);
    setFormCourtId(selectedCourt ?? null);
    setBatchDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchedule(null);
    setFormData({ date: "", start_time: "", end_time: "" });
  };

  const handleCloseBatchDialog = () => {
    setBatchDialogOpen(false);
    setBatchFormData({
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      interval_minutes: "60",
      weekdays: [],
    });
  };

  const toggleWeekday = (day: number) => {
    setBatchFormData((prev) => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter((d) => d !== day)
        : [...prev.weekdays, day],
    }));
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (arenas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma arena cadastrada
        </h3>
        <p className="text-gray-600 mb-6">
          Você precisa criar uma arena antes de adicionar horários
        </p>
        <a href="/owner/arenas">
          <Button className="mx-auto">Criar Arena</Button>
        </a>
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma quadra cadastrada
        </h3>
        <p className="text-gray-600 mb-6">
          Você precisa criar quadras antes de adicionar horários
        </p>
        <a href="/owner/courts">
          <Button className="mx-auto">Criar Quadra</Button>
        </a>
      </div>
    );
  }

  const groupedSchedules = schedules.reduce(
    (acc, schedule) => {
      if (!acc[schedule.date]) {
        acc[schedule.date] = [];
      }
      acc[schedule.date].push(schedule);
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Horários</h2>
            <p className="text-gray-600 mt-2">
              Gerencie os horários disponíveis
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Dialog
              open={batchDialogOpen}
              onOpenChange={(open) => {
                if (!open) handleCloseBatchDialog();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={handleOpenBatchDialog}
                >
                  <Clock className="h-5 w-5" />
                  Criar em Lote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Horários em Lote</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBatchSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="batch_arena">Arena</Label>
                      <Select
                        value={formArenaId?.toString()}
                        onValueChange={(value) =>
                          setFormArenaId(parseInt(value))
                        }
                      >
                        <SelectTrigger id="batch_arena" className="w-full">
                          <SelectValue placeholder="Selecione arena" />
                        </SelectTrigger>
                        <SelectContent>
                          {arenas.map((arena) => (
                            <SelectItem
                              key={arena.id}
                              value={arena.id.toString()}
                            >
                              {capitalizeWords(arena.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="batch_court">Quadra</Label>
                      <Select
                        value={formCourtId?.toString()}
                        onValueChange={(value) =>
                          setFormCourtId(parseInt(value))
                        }
                        disabled={!formArenaId || formCourts.length === 0}
                      >
                        <SelectTrigger id="batch_court" className="w-full">
                          <SelectValue placeholder="Selecione quadra" />
                        </SelectTrigger>
                        <SelectContent>
                          {formCourts.map((court) => (
                            <SelectItem
                              key={court.id}
                              value={court.id.toString()}
                            >
                              {capitalizeWords(court.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Data Início</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={batchFormData.start_date}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            start_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">Data Fim</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={batchFormData.end_date}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            end_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="batch_start_time">Hora Início</Label>
                      <Input
                        id="batch_start_time"
                        type="time"
                        value={batchFormData.start_time}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            start_time: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="batch_end_time">Hora Fim</Label>
                      <Input
                        id="batch_end_time"
                        type="time"
                        value={batchFormData.end_time}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            end_time: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="interval">Intervalo (min)</Label>
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        value={batchFormData.interval_minutes}
                        onChange={(e) =>
                          setBatchFormData({
                            ...batchFormData,
                            interval_minutes: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Dias da Semana (opcional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {weekdayLabels.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleWeekday(day.value)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            batchFormData.weekdays.includes(day.value)
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCloseBatchDialog}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Horários</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                if (!open) handleCloseDialog();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  onClick={handleOpenCreateDialog}
                >
                  <Plus className="h-5 w-5" />
                  Novo Horário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSchedule ? "Editar Horário" : "Novo Horário"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="single_arena">Arena</Label>
                      <Select
                        value={formArenaId?.toString()}
                        onValueChange={(value) =>
                          setFormArenaId(parseInt(value))
                        }
                      >
                        <SelectTrigger id="single_arena" className="w-full">
                          <SelectValue placeholder="Selecione arena" />
                        </SelectTrigger>
                        <SelectContent>
                          {arenas.map((arena) => (
                            <SelectItem
                              key={arena.id}
                              value={arena.id.toString()}
                            >
                              {capitalizeWords(arena.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="single_court">Quadra</Label>
                      <Select
                        value={formCourtId?.toString()}
                        onValueChange={(value) =>
                          setFormCourtId(parseInt(value))
                        }
                        disabled={!formArenaId || formCourts.length === 0}
                      >
                        <SelectTrigger id="single_court" className="w-full">
                          <SelectValue placeholder="Selecione quadra" />
                        </SelectTrigger>
                        <SelectContent>
                          {formCourts.map((court) => (
                            <SelectItem
                              key={court.id}
                              value={court.id.toString()}
                            >
                              {capitalizeWords(court.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_time">Hora Início</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_time: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">Hora Fim</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({ ...formData, end_time: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCloseDialog}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingSchedule ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum horário cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando horários para esta quadra
          </p>
          <p className="text-sm text-gray-500">
            Use as ações no topo para criar horários.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedules)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, daySchedules]) => (
              <div key={date} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {daySchedules
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:border-green-600 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-emerald-50 text-emerald-600">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {schedule.start_time} - {schedule.end_time}
                              </p>
                              <p className="text-xs text-gray-500">
                                Horário disponível
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => handleEdit(schedule)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

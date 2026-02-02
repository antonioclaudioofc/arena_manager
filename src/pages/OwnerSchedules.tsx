import { useContext, useEffect, useState } from "react";
import { CalendarDays, Pencil, Trash2, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
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
import { AuthContext } from "../providers/AuthProvider";

interface Arena {
  id: number;
  name: string;
}

interface Court {
  id: number;
  name: string;
  arena_id: number;
}

interface Schedule {
  id: number;
  court_id: number;
  date: string;
  start_time: string;
  end_time: string;
  court?: {
    name: string;
    arena_id: number;
  };
}

export default function OwnerSchedules() {
  const { token } = useContext(AuthContext);
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [selectedArena, setSelectedArena] = useState<number | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
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
    months: [] as number[],
  });

  const API_BASE = import.meta.env.VITE_API_BASE;

  const weekdayLabels = [
    { value: 0, label: "Segunda" },
    { value: 1, label: "Terça" },
    { value: 2, label: "Quarta" },
    { value: 3, label: "Quinta" },
    { value: 4, label: "Sexta" },
    { value: 5, label: "Sábado" },
    { value: 6, label: "Domingo" },
  ];

  const monthLabels = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        const response = await fetch(`${API_BASE}/arenas/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArenas(data);
          if (data.length > 0) {
            setSelectedArena(data[0].id);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar arenas:", err);
        toast.error("Erro ao carregar arenas");
      } finally {
        setLoading(false);
      }
    };

    fetchArenas();
  }, [token]);

  useEffect(() => {
    if (selectedArena) {
      fetchCourts(selectedArena);
    }
  }, [selectedArena]);

  useEffect(() => {
    if (selectedCourt) {
      fetchSchedules(selectedCourt);
    }
  }, [selectedCourt]);

  const fetchCourts = async (arenaId: number) => {
    try {
      const response = await fetch(`${API_BASE}/courts/${arenaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourts(data);
        if (data.length > 0) {
          setSelectedCourt(data[0].id);
        }
      } else {
        setCourts([]);
        setSelectedCourt(null);
      }
    } catch (err) {
      console.error("Erro ao buscar quadras:", err);
    }
  };

  const fetchSchedules = async (courtId: number) => {
    try {
      const response = await fetch(
        `${API_BASE}/catalog/courts/${courtId}/schedules`,
      );

      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.start_time || !formData.end_time) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (!selectedCourt) {
      toast.error("Selecione uma quadra");
      return;
    }

    try {
      if (editingSchedule) {
        // Atualizar horário existente
        const response = await fetch(
          `${API_BASE}/schedules/${editingSchedule.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          },
        );

        if (response.ok) {
          toast.success("Horário atualizado com sucesso");
          fetchSchedules(selectedCourt);
          handleCloseDialog();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Erro ao atualizar horário");
        }
      } else {
        // Criar novo horário
        const response = await fetch(`${API_BASE}/schedules/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            court_id: selectedCourt,
            ...formData,
          }),
        });

        if (response.ok) {
          toast.success("Horário criado com sucesso");
          fetchSchedules(selectedCourt);
          handleCloseDialog();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Erro ao criar horário");
        }
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao salvar horário");
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

    if (!selectedCourt) {
      toast.error("Selecione uma quadra");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/schedules/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          court_id: selectedCourt,
          start_date: batchFormData.start_date,
          end_date: batchFormData.end_date,
          start_time: batchFormData.start_time,
          end_time: batchFormData.end_time,
          interval_minutes: parseInt(batchFormData.interval_minutes),
          weekdays:
            batchFormData.weekdays.length > 0
              ? batchFormData.weekdays
              : undefined,
          months:
            batchFormData.months.length > 0 ? batchFormData.months : undefined,
        }),
      });

      if (response.ok) {
        toast.success("Horários criados em lote com sucesso");
        fetchSchedules(selectedCourt);
        handleCloseBatchDialog();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erro ao criar horários em lote");
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao criar horários em lote");
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
      const response = await fetch(`${API_BASE}/schedules/${scheduleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Horário deletado com sucesso");
        if (selectedCourt) {
          fetchSchedules(selectedCourt);
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erro ao deletar horário");
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao deletar horário");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      date: schedule.date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });
    setDialogOpen(true);
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
      months: [],
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

  const toggleMonth = (month: number) => {
    setBatchFormData((prev) => ({
      ...prev,
      months: prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month],
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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Horários</h2>
          <p className="text-gray-600 mt-2">Gerencie os horários disponíveis</p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <Select
            value={selectedArena?.toString()}
            onValueChange={(value) => setSelectedArena(parseInt(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione arena" />
            </SelectTrigger>
            <SelectContent>
              {arenas.map((arena) => (
                <SelectItem key={arena.id} value={arena.id.toString()}>
                  {arena.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedCourt?.toString()}
            onValueChange={(value) => setSelectedCourt(parseInt(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione quadra" />
            </SelectTrigger>
            <SelectContent>
              {courts.map((court) => (
                <SelectItem key={court.id} value={court.id.toString()}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
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
                <div>
                  <Label>Meses (opcional)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {monthLabels.map((month) => (
                      <button
                        key={month.value}
                        type="button"
                        onClick={() => toggleMonth(month.value)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          batchFormData.months.includes(month.value)
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {month.label}
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
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
                        setFormData({ ...formData, start_time: e.target.value })
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

      {schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum horário cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando horários para esta quadra
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Criar Horário
            </Button>
            <Button
              variant="secondary"
              onClick={() => setBatchDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Clock className="h-5 w-5" />
              Criar em Lote
            </Button>
          </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {daySchedules
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-600 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-900">
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(schedule)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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

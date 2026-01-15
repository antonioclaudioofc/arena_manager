import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/Dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/Form";
import { Input } from "../components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { Button } from "../components/Button";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const scheduleFormSchema = z.object({
  court_id: z.string().min(1, "Selecione uma quadra"),
  date: z.string().min(1, "Data é obrigatória"),
  start_time: z.string().min(1, "Horário inicial é obrigatório"),
  end_time: z.string().min(1, "Horário final é obrigatório"),
  available: z.boolean().default(true),
});

interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
  court: {
    id: number;
    name: string;
    sports_type: string;
    description: string;
  };
  created_at: string;
  updated_at: string;
}

interface Court {
  id: number;
  name: string;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminSchedules() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const { token } = useContext(AuthContext);

  const fetchCourts = async () => {
    try {
      const response = await fetch(`${API_BASE}/courts/`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao buscar quadras");

        return;
      }

      setCourts(data);
    } catch (err) {
      console.error("Erro ao buscar quadras:", err);
      toast.error("Erro ao carregar quadras");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/schedules/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao buscar Horários");

        return;
      }

      setSchedules(data);
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
      toast.error("Erro ao carregar horários");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE}/admin/schedules/${scheduleToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao excluir Horário");

        return;
      }

      toast.success(data.message || "Horário excluído com sucesso!");
      fetchSchedules();
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    } catch (err: any) {
      console.error("Erro ao excluir horário:", err);
      toast.error(err.message || "Erro ao excluir horário");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchedule(null);
  };

  useEffect(() => {
    fetchCourts();
    fetchSchedules();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Horários</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-max">+ Novo Horário</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Editar Horário" : "Adicionar Novo Horário"}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule
                  ? "Atualize os dados do horário"
                  : "Preencha os dados para criar um novo horário disponível"}
              </DialogDescription>
            </DialogHeader>
            <FormSchedule
              setDialogOpen={handleCloseDialog}
              onSuccess={fetchSchedules}
              editingSchedule={editingSchedule}
              courts={courts}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
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
                Horário Início
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horário Fim
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
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    Carregando horários...
                  </div>
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Nenhum horário cadastrado ainda
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => {
                return (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.court.name.toUpperCase() ??
                        `Quadra ${schedule.court.name}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(schedule.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.start_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.end_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs  ${
                          schedule.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {schedule.available ? "Disponível" : "Indisponível"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer transition-color"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(schedule.id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer transition-color"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este horário? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setScheduleToDelete(null);
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

function FormSchedule({
  setDialogOpen,
  onSuccess,
  editingSchedule,
  courts,
}: {
  setDialogOpen: () => void;
  onSuccess: () => void;
  editingSchedule: Schedule | null;
  courts: Court[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  const form = useForm({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      court_id: editingSchedule?.court.id.toString() || "",
      date: editingSchedule?.date || "",
      start_time: editingSchedule?.start_time || "",
      end_time: editingSchedule?.end_time || "",
      available: editingSchedule?.available ?? true,
    },
  } as any);

  useEffect(() => {
    if (editingSchedule) {
      form.reset({
        court_id: editingSchedule.court.id.toString(),
        date: editingSchedule.date,
        start_time: editingSchedule.start_time,
        end_time: editingSchedule.end_time,
        available: editingSchedule.available,
      });
    } else {
      form.reset({
        court_id: "",
        date: "",
        start_time: "",
        end_time: "",
        available: true,
      });
    }
  }, [editingSchedule]);

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const payload = {
        date: values.date,
        start_time: values.start_time,
        end_time: values.end_time,
        available: values.available,
        court_id: Number(values.court_id),
      };

      const url = editingSchedule
        ? `${API_BASE}/admin/schedules/${editingSchedule.id}`
        : `${API_BASE}/admin/schedules/`;

      const method = editingSchedule ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao salvar horário");

        return;
      }

      toast.success(
        editingSchedule
          ? data.message || "Horário atualizado com sucesso!"
          : data.message || "Horário adicionado com sucesso!"
      );

      onSuccess();
      setDialogOpen();
      form.reset();
    } catch (err: any) {
      console.error("Erro ao salvar horário:", err);
      toast.error(err.message || "Erro ao salvar horário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="court_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quadra</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!editingSchedule}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma quadra" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id.toString()}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário Início</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário Fim</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Disponível</SelectItem>
                  <SelectItem value="false">Indisponível</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={setDialogOpen}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? editingSchedule
                ? "Atualizando..."
                : "Adicionando..."
              : editingSchedule
              ? "Atualizar Horário"
              : "Adicionar Horário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

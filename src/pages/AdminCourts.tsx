import { useState, useContext, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import {
  Dialog,
  DialogHeader,
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
import { X } from "lucide-react";

const sports = ["FutVôlei", "Vôlei", "Beach tennis"];

const courtsFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  sports: z.array(z.string()).min(1, "Selecione pelo menos um esporte"),
  description: z.string().optional(),
});

interface Court {
  id: number;
  name: string;
  sports_type: string;
  description: string;
  created_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminCourts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState<number | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const { token } = useContext(AuthContext);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courts`);

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao buscar Quadras");

        return;
      }

      setCourts(data);
    } catch (err) {
      console.error("Erro ao buscar quadras:", err);
      toast.error("Erro ao carregar quadras");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCourtToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courtToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE}/admin/courts/${courtToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao deletar quadra");

        return;
      }

      toast.success(data.message || "Quadra excluída com sucesso!");
      fetchCourts();
      setDeleteDialogOpen(false);
      setCourtToDelete(null);
    } catch (err: any) {
      console.error("Erro ao excluir quadra:", err);
      toast.error(err.message || "Erro ao excluir quadra");
    }
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourt(null);
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Quadras</h1>
        <Button
          onClick={() => {
            setEditingCourt(null);
            setDialogOpen(true);
          }}
          className="w-max"
        >
          + Nova Quadra
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <FormCourt
            setDialogOpen={handleCloseDialog}
            onSuccess={fetchCourts}
            editingCourt={editingCourt}
          />
        </DialogContent>
      </Dialog>

      {loading ? (
        "Carregando arenas"
      ) : (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className=" px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className=" px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Esporte
                </th>
                <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className=" px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {courts.map((court) => (
                <tr key={court.id}>
                  <td className="px-3 sm:px-4 lg:px-6 py-4 text-sm font-medium text-gray-900 ">
                    {court.name.toLocaleUpperCase()}
                  </td>

                  <td className="px-3 sm:px-4 lg:px-6 py-4 text-sm text-gray-500 ">
                    {court.sports_type.toLocaleUpperCase()}
                  </td>

                  <td className="px-3 sm:px-4 lg:px-6 py-4 text-sm text-gray-500  line-clamp-2">
                    {court.description}
                  </td>

                  <td className="px-3 sm:px-4 lg:px-6 py-4 text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(court)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(court.id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta quadra? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCourtToDelete(null);
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

function FormCourt({
  setDialogOpen,
  onSuccess,
  editingCourt,
}: {
  setDialogOpen: () => void;
  onSuccess: () => void;
  editingCourt: Court | null;
}) {
  const [selectedSport, setSelectedSport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  const form = useForm({
    resolver: zodResolver(courtsFormSchema),
    defaultValues: {
      name: editingCourt?.name || "",
      sports: editingCourt?.sports_type.split(", ") || [],
      description: editingCourt?.description || "",
    },
  } as any);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sports",
  });

  useEffect(() => {
    if (editingCourt) {
      form.reset({
        name: editingCourt.name,
        sports: editingCourt.sports_type.split(", "),
        description: editingCourt.description,
      });
    } else {
      form.reset({
        name: "",
        sports: [],
        description: "",
      });
    }
  }, [editingCourt, form]);

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        sports_type: values.sports.join(", "),
        description: values.description,
      };

      const url = editingCourt
        ? `${API_BASE}/admin/courts/${editingCourt.id}`
        : `${API_BASE}/admin/courts/`;

      const method = editingCourt ? "PUT" : "POST";

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
        toast.error(
          data.message ||
            `Erro ao ${editingCourt ? "atualizar" : "adicionar"} quadra`
        );

        return;
      }

      toast.success(
        data.message ||
          `Quadra ${editingCourt ? "atualizada" : "adicionada"} com sucesso!`
      );
      setDialogOpen();
      form.reset();

      onSuccess();
    } catch (err: any) {
      console.error(
        `Erro ao ${editingCourt ? "atualizar" : "adicionar"} quadra:`,
        err
      );
      toast.error(
        err.message ||
          `Erro ao ${editingCourt ? "atualizar" : "adicionar"} quadra`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSport = (value: string) => {
    if (value && !form.getValues("sports").includes(value)) {
      append(value);
      setSelectedSport("");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingCourt ? "Editar Quadra" : "Adicionar Nova Quadra"}
        </DialogTitle>
        <DialogDescription>
          {editingCourt
            ? "Atualize os dados da quadra"
            : "Preencha os dados da nova quadra para adicioná-la ao sistema"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Quadra</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Arena Prime" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Esportes Disponíveis</FormLabel>
            <div className="space-y-3">
              <Select value={selectedSport} onValueChange={addSport}>
                <SelectTrigger>
                  <SelectValue placeholder="+ Adicionar esporte" />
                </SelectTrigger>
                <SelectContent>
                  {sports
                    .filter((s) => !form.getValues("sports").includes(s))
                    .map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {fields.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-2 items-center animate-in slide-in-from-top-2 duration-200"
                    >
                      <FormField
                        control={form.control}
                        name={`sports.${index}`}
                        render={({ field: fieldProps }) => (
                          <div className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-green-50 text-sm font-medium text-green-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {fieldProps.value}
                          </div>
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0"
                        title="Remover esporte"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fields.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Nenhum esporte adicionado ainda
                </p>
              )}
            </div>
            {form.formState.errors.sports && (
              <span className="text-xs text-red-600">
                Selecione pelo menos um esporte
              </span>
            )}
          </FormItem>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Ex: Quadra coberta de futebol com alambrado"
                    className="bg-white border border-gray-400 text-black text-sm rounded-md placeholder:text-gray-600 focus:ring-green-700 focus:bg-gray-100 focus:border-green-700 focus:ring-1 block w-full p-4 outline-none resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-3 justify-end pt-4">
            <Button
              type="button"
              variant={"destructive"}
              onClick={setDialogOpen}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? editingCourt
                  ? "Atualizando..."
                  : "Adicionando..."
                : editingCourt
                ? "Atualizar Quadra"
                : "Adicionar Quadra"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

import { useState, useEffect } from "react";
import { Trophy, Pencil, Trash2, Plus } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/Form";
import { useForm } from "react-hook-form";
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
  useCreateOwnerCourt,
  useUpdateOwnerCourt,
  useDeleteOwnerCourt,
} from "../hooks/use-owner";
import type { Court, CourtRequest, CourtUpdate } from "../types/court";
import { capitalizeWords } from "../utils/capitalizeWords";

export default function OwnerCourts() {
  const {
    data: arenas = [],
    isLoading: arenasLoading,
    isError: arenasError,
  } = useOwnerArenas();
  const [formSelectedArena, setFormSelectedArena] = useState<number | null>(
    null,
  );

  const {
    data: courts = [],
    isLoading: courtsLoading,
    isError: courtsError,
    refetch: refetchCourts,
  } = useOwnerCourtsByArena(formSelectedArena);

  const { mutate: createCourt, isPending: isCreating } = useCreateOwnerCourt();
  const { mutate: updateCourt, isPending: isUpdating } = useUpdateOwnerCourt();
  const { mutate: deleteCourt, isPending: isDeleting } = useDeleteOwnerCourt();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [courtToDelete, setCourtToDelete] = useState<Court | null>(null);

  const form = useForm({
    defaultValues: {
      arena_id: "",
      name: "",
      sports_type: "",
      price_per_hour: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!formSelectedArena && arenas.length > 0) {
      setFormSelectedArena(arenas[0].id);
    }
  }, [arenas, formSelectedArena]);

  useEffect(() => {
    if (dialogOpen && !editingCourt) {
      form.reset({
        arena_id: "",
        name: "",
        sports_type: "",
        price_per_hour: "",
      });
    }
  }, [dialogOpen, editingCourt, form]);

  const handleSubmit = (data: any) => {
    const arenaId = Number(data.arena_id);
    if (!arenaId) {
      toast.error("Selecione uma arena");
      return;
    }

    const price = Number(data.price_per_hour);
    if (!data.name || !data.sports_type || Number.isNaN(price)) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (editingCourt) {
      const payload: CourtUpdate = {
        name: data.name,
        sports_type: data.sports_type,
        price_per_hour: price,
      };
      updateCourt(
        { id: editingCourt.id, payload },
        {
          onSuccess: () => {
            toast.success("Quadra atualizada com sucesso!");
            handleCloseDialog();
          },
        },
      );
      return;
    }

    const payload: CourtRequest = {
      arena_id: arenaId,
      name: data.name,
      sports_type: data.sports_type,
      price_per_hour: price,
    };

    createCourt(payload, {
      onSuccess: () => {
        setFormSelectedArena(arenaId);
        refetchCourts();
        toast.success("Quadra criada com sucesso!");
        handleCloseDialog();
      },
    });
  };

  const handleDelete = (court: Court) => {
    setCourtToDelete(court);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!courtToDelete) return;
    deleteCourt(courtToDelete.id, {
      onSuccess: () => {
        toast.success("Quadra deletada com sucesso!");
        setDeleteDialogOpen(false);
        setCourtToDelete(null);
        refetchCourts();
      },
    });
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    form.reset({
      arena_id: court.arena_id?.toString() || "",
      name: court.name,
      sports_type: court.sports_type,
      price_per_hour: court.price_per_hour.toString(),
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourt(null);
    form.reset({ arena_id: "", name: "", sports_type: "", price_per_hour: "" });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCourtToDelete(null);
  };

  if (arenasLoading || courtsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (arenasError || courtsError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-700 text-lg font-medium">
          Não foi possível carregar as quadras
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Tente novamente em alguns instantes.
        </p>
      </div>
    );
  }

  if (arenas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma arena cadastrada
        </h3>
        <p className="text-gray-600 mb-6">
          Você precisa criar uma arena antes de adicionar quadras
        </p>
        <a href="/owner/arenas">
          <Button className="mx-auto">Criar Arena</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quadras</h2>
          <p className="text-gray-600 mt-2">
            Gerencie as quadras das suas arenas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 p-4 w-max">
              <Plus className="h-4 w-4" />
              Adicionar Quadra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCourt ? "Editar Quadra" : "Nova Quadra"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {!editingCourt && (
                  <FormField
                    control={form.control}
                    name="arena_id"
                    rules={{ required: "Arena é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arena</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setFormSelectedArena(Number(value));
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma arena" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {arenas.map((arena) => (
                              <SelectItem
                                key={arena.id}
                                value={arena.id.toString()}
                              >
                                {capitalizeWords(arena.name)} -{" "}
                                {capitalizeWords(arena.city)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Nome da quadra é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Quadra</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Quadra 1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sports_type"
                  rules={{ required: "Tipo de esporte é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Esporte</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Futebol, Vôlei, Basquete"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_per_hour"
                  rules={{ required: "Preço é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por Hora (R$)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Ex: 100.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="secondary"
                    onClick={handleCloseDialog}
                    disabled={isCreating || isUpdating}
                  >
                    Cancelar
                  </Button>
                  <Button disabled={isCreating || isUpdating}>
                    {isUpdating
                      ? "Atualizando..."
                      : isCreating
                        ? "Criando..."
                        : editingCourt
                          ? "Atualizar"
                          : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Tem certeza que deseja deletar a quadra
              {courtToDelete ? ` "${courtToDelete.name}"` : ""}?
            </p>
            <p className="text-red-600">
              Todos os horários e reservas serão removidos.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {courts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma quadra cadastrada
          </h3>
          <p className="text-gray-600 mb-6">Comece adicionando uma quadra</p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Adicionar Quadra
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courts.map((court) => (
            <div
              key={court.id}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {capitalizeWords(court.name)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {capitalizeWords(court.sports_type)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  R$ {court.price_per_hour.toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(court)}
                  disabled={isUpdating || isDeleting}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(court)}
                  disabled={isDeleting || isUpdating}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

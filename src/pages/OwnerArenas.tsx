import { useState, useMemo } from "react";
import { Building2, Pencil, Trash2, Plus, MapPin, Search } from "lucide-react";
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
  useArenas,
  useCreateArena,
  useUpdateArena,
  useDeleteArena,
} from "../hooks/use-arena";
import type { Arena, ArenaUpdate } from "../types/arena";
import { capitalizeWords } from "../utils/capitalizeWords";

export default function OwnerArenas() {
  const { data: arenas = [], isLoading, isError } = useArenas();
  const { mutate: createArena, isPending: isCreating } = useCreateArena();
  const { mutate: updateArena, isPending: isUpdating } = useUpdateArena();
  const { mutate: deleteArena, isPending: isDeleting } = useDeleteArena();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArena, setEditingArena] = useState<Arena | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [arenaToDelete, setArenaToDelete] = useState<Arena | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      city: "",
      address: "",
    },
    mode: "onChange",
  });

  const filteredArenas = useMemo(() => {
    if (!searchQuery.trim()) return arenas;
    const query = searchQuery.toLowerCase();
    return arenas.filter(
      (arena) =>
        arena.name.toLowerCase().includes(query) ||
        arena.city.toLowerCase().includes(query) ||
        arena.address.toLowerCase().includes(query),
    );
  }, [arenas, searchQuery]);

  const handleSubmit = (data: any) => {
    const capitalizedData = {
      name: capitalizeWords(data.name),
      city: capitalizeWords(data.city),
      address: capitalizeWords(data.address),
    };

    if (editingArena) {
      updateArena(
        { id: editingArena.id, payload: capitalizedData as ArenaUpdate },
        {
          onSuccess: handleCloseDialog,
        },
      );
    } else {
      createArena(capitalizedData, {
        onSuccess: handleCloseDialog,
      });
    }
  };

  const handleEdit = (arena: Arena) => {
    setEditingArena(arena);
    form.reset({
      name: arena.name,
      city: arena.city,
      address: arena.address,
    });
    setDialogOpen(true);
  };

  const handleDelete = (arena: Arena) => {
    if (arenas.length <= 1) {
      toast.error("Você precisa manter pelo menos 1 arena cadastrada.");
      return;
    }

    setArenaToDelete(arena);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!arenaToDelete) return;

    deleteArena(arenaToDelete.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setArenaToDelete(null);
      },
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArena(null);
    form.reset({
      name: "",
      city: "",
      address: "",
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setArenaToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-700 text-lg font-medium">
          Não foi possível carregar suas arenas
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Tente novamente em alguns instantes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Minhas Arenas</h2>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie todas as suas arenas esportivas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap w-max p-6"
            >
              <Plus className="h-4 w-4" />
              Nova Arena
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingArena ? "Editar Arena" : "Nova Arena"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Nome da arena é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Arena</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Arena Central" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  rules={{ required: "Cidade é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: São Paulo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Endereço é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Rua Exemplo, 123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2 justify-end pt-2">
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
                        : editingArena
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
              Tem certeza que deseja deletar a arena
              {arenaToDelete ? ` "${arenaToDelete.name}"` : ""}?
            </p>
            <p className="text-red-600">
              Todas as quadras, horários e reservas serão removidos.
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar arenas por nome, cidade ou endereço..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {arenas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma arena cadastrada
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando sua primeira arena esportiva
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Criar Primeira Arena
          </Button>
        </div>
      ) : filteredArenas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Nenhuma arena encontrada com essa busca
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArenas.map((arena) => (
            <div
              key={arena.id}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {capitalizeWords(arena.name)}
                  </h3>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-green-600 " />
                      <span className="truncate">
                        {capitalizeWords(arena.city)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {capitalizeWords(arena.address)}
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 pt-3 gap-3 border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(arena)}
                  disabled={isUpdating || isDeleting}
                  className="flex-1 text-sm px-2 py-1.5"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(arena)}
                  disabled={isDeleting || isUpdating}
                  className="px-2 py-1.5"
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

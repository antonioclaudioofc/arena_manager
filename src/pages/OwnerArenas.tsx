import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Building2, Pencil, Trash2, Plus } from "lucide-react";
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
import { useSearchParams } from "react-router";

interface Arena {
  id: number;
  name: string;
  city: string;
  address: string;
  owner_id: number;
}

export default function OwnerArenas() {
  const { token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArena, setEditingArena] = useState<Arena | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE;

  // Abrir diálogo automaticamente se veio do registro
  useEffect(() => {
    if (searchParams.get("newArena") === "true") {
      setDialogOpen(true);
    }
  }, [searchParams]);

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
      } else if (response.status === 403) {
        // Usuário ainda não tem arenas
        setArenas([]);
      } else {
        toast.error("Erro ao carregar arenas");
      }
    } catch (err) {
      console.error("Erro ao buscar arenas:", err);
      toast.error("Erro ao carregar arenas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArenas();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.city || !formData.address) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    try {
      if (editingArena) {
        // Atualizar arena existente
        const response = await fetch(
          `${API_BASE}/arenas/${editingArena.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          toast.success("Arena atualizada com sucesso");
          fetchArenas();
          handleCloseDialog();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Erro ao atualizar arena");
        }
      } else {
        // Criar nova arena
        const response = await fetch(`${API_BASE}/arenas/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Arena criada com sucesso");
          fetchArenas();
          handleCloseDialog();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Erro ao criar arena");
        }
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao salvar arena");
    }
  };

  const handleDelete = async (arenaId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta arena? Todas as quadras, horários e reservas serão removidos.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/arenas/${arenaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Arena deletada com sucesso");
        fetchArenas();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erro ao deletar arena");
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao deletar arena");
    }
  };

  const handleEdit = (arena: Arena) => {
    setEditingArena(arena);
    setFormData({
      name: arena.name,
      city: arena.city,
      address: arena.address,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArena(null);
    setFormData({ name: "", city: "", address: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Minhas Arenas</h2>
          <p className="text-gray-600 mt-2">
            Gerencie todas as suas arenas esportivas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nova Arena
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingArena ? "Editar Arena" : "Nova Arena"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Arena</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Arena Central"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Ex: Rua Exemplo, 123"
                  required
                />
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
                  {editingArena ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arenas.map((arena) => (
            <div
              key={arena.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {arena.name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Cidade:</span> {arena.city}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Endereço:</span>{" "}
                  {arena.address}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(arena)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(arena.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

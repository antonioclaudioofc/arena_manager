import { useContext, useEffect, useState } from "react";
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
  city: string;
}

interface Court {
  id: number;
  name: string;
  arena_id: number;
  sports_type: string;
  price_per_hour: number;
}

export default function OwnerCourts() {
  const { token } = useContext(AuthContext);
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [selectedArena, setSelectedArena] = useState<number | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sports_type: "",
    price_per_hour: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE;

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
      } else {
        setCourts([]);
      }
    } catch (err) {
      console.error("Erro ao buscar quadras:", err);
      toast.error("Erro ao carregar quadras");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sports_type || !formData.price_per_hour) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (!selectedArena) {
      toast.error("Selecione uma arena");
      return;
    }

    try {
      if (editingCourt) {
        // Atualizar quadra existente
        const response = await fetch(`${API_BASE}/courts/${editingCourt.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            sports_type: formData.sports_type,
            price_per_hour: parseFloat(formData.price_per_hour),
          }),
        });

        if (response.ok) {
          toast.success("Quadra atualizada com sucesso");
          fetchCourts(selectedArena);
          handleCloseDialog();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Erro ao atualizar quadra");
        }
      } else {
        // Criar nova quadra
        const response = await fetch(`${API_BASE}/courts/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            arena_id: selectedArena,
            name: formData.name,
            sports_type: formData.sports_type,
            price_per_hour: parseFloat(formData.price_per_hour),
          }),
        });

        if (response.ok) {
          toast.success("Quadra criada com sucesso");
          fetchCourts(selectedArena);
          handleCloseDialog();
        } else {
          const error = await response.json();
          toast.error(error.detail || "Erro ao criar quadra");
        }
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao salvar quadra");
    }
  };

  const handleDelete = async (courtId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta quadra? Todos os horários e reservas serão removidos.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/courts/${courtId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Quadra deletada com sucesso");
        if (selectedArena) {
          fetchCourts(selectedArena);
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erro ao deletar quadra");
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao deletar quadra");
    }
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      sports_type: court.sports_type,
      price_per_hour: court.price_per_hour.toString(),
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourt(null);
    setFormData({ name: "", sports_type: "", price_per_hour: "" });
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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quadras</h2>
          <p className="text-gray-600 mt-2">Gerencie as quadras das suas arenas</p>
        </div>
        <div className="flex gap-4 items-center">
          <Select
            value={selectedArena?.toString()}
            onValueChange={(value) => setSelectedArena(parseInt(value))}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione uma arena" />
            </SelectTrigger>
            <SelectContent>
              {arenas.map((arena) => (
                <SelectItem key={arena.id} value={arena.id.toString()}>
                  {arena.name} - {arena.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Quadra
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCourt ? "Editar Quadra" : "Nova Quadra"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Quadra</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Quadra 1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sports_type">Tipo de Esporte</Label>
                  <Input
                    id="sports_type"
                    value={formData.sports_type}
                    onChange={(e) =>
                      setFormData({ ...formData, sports_type: e.target.value })
                    }
                    placeholder="Ex: Futebol, Vôlei, Basquete"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price_per_hour">Preço por Hora (R$)</Label>
                  <Input
                    id="price_per_hour"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_hour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_hour: e.target.value,
                      })
                    }
                    placeholder="Ex: 100.00"
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
                    {editingCourt ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {courts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma quadra cadastrada
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando a primeira quadra desta arena
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Criar Primeira Quadra
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div
              key={court.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {court.name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Esporte:</span>{" "}
                  {court.sports_type}
                </p>
                <p className="text-gray-900 text-lg font-semibold">
                  R$ {court.price_per_hour.toFixed(2)}/hora
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(court)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(court.id)}
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

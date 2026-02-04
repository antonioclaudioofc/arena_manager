import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "../components/Button";
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
import { useAuth } from "../providers/AuthProvider";
import { useCreateArena } from "../hooks/use-arena";
import {
  ArrowLeft,
  CheckCircle2,
  Building2,
  MapPin,
  FileText,
  Target,
  ClipboardList,
} from "lucide-react";
import logo from "../assets/logo.svg";

export default function BecomeOwner() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { mutate: createArena, isPending } = useCreateArena();
  const [step, setStep] = useState(1);
  const form = useForm({
    defaultValues: {
      name: "",
      city: "",
      address: "",
      terms: false,
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();

  const handleCreateArena = () => {
    const values = form.getValues();
    if (!values.name.trim() || !values.city.trim() || !values.address.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createArena(
      {
        name: values.name.trim(),
        city: values.city.trim(),
        address: values.address.trim(),
      },
      {
        onSuccess: async () => {
          await refreshUser();
          navigate("/owner");
        },
      },
    );
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return Boolean(watchedValues.terms);
      case 2:
        return watchedValues.name?.trim() !== "";
      case 3:
        return watchedValues.city?.trim() !== "";
      case 4:
        return watchedValues.address?.trim() !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl p-6 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <img src={logo} alt="Arena Manager" className="w-10 h-10" />
            </div>
            <h1 className="text-lg font-semibold text-gray-800">
              Tornar-se Dono de Arena
            </h1>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <div
                className="absolute top-5 h-1 rounded-full bg-gray-200 z-0"
                style={{ left: "12.5%", right: "12.5%" }}
              >
                <div
                  className="h-1 rounded-full bg-emerald-600 transition-all"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-4 items-center relative z-10">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex justify-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                        s < step
                          ? "bg-emerald-600 text-white"
                          : s === step
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 mt-2 text-center">
              <span className="text-xs text-gray-600">Termos</span>
              <span className="text-xs text-gray-600">Nome</span>
              <span className="text-xs text-gray-600">Cidade</span>
              <span className="text-xs text-gray-600">Endereço</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <Form {...form}>
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Termos e Condições
                    </h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">
                      Bem-vindo ao Arena Manager
                    </h3>

                    <div className="space-y-4 text-gray-700">
                      <p>
                        Ao se tornar um <strong>Dono de Arena</strong>, você
                        concorda com as seguintes condições:
                      </p>

                      <div>
                        <h4 className="font-semibold mb-2">
                          1. Responsabilidades
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Manter informações precisas e atualizadas sobre suas
                            arenas
                          </li>
                          <li>
                            Garantir a disponibilidade das quadras conforme
                            agendado
                          </li>
                          <li>
                            Honrar todas as reservas confirmadas pelos clientes
                          </li>
                          <li>
                            Responder prontamente a dúvidas e problemas dos
                            usuários
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          2. Gestão de Arenas
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Você pode gerenciar múltiplas arenas na plataforma
                          </li>
                          <li>
                            Cada arena pode ter múltiplas quadras com horários
                            independentes
                          </li>
                          <li>
                            Os preços são definidos por você e podem ser
                            alterados a qualquer momento
                          </li>
                          <li>
                            Horários bloqueados ou reservados não podem ser
                            removidos
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          3. Política de Cancelamento
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Clientes podem cancelar reservas até 24 horas antes
                            do horário
                          </li>
                          <li>
                            Cancelamentos feitos pelo proprietário devem ser
                            justificados
                          </li>
                          <li>
                            Em caso de problemas recorrentes, a arena pode ser
                            suspensa
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          4. Pagamentos e Taxas
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            A plataforma cobra uma taxa de 10% sobre cada
                            reserva
                          </li>
                          <li>Os pagamentos são processados semanalmente</li>
                          <li>
                            Você é responsável pela emissão de notas fiscais
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          5. Privacidade e Dados
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Seus dados pessoais e comerciais são protegidos por
                            nossas políticas de privacidade
                          </li>
                          <li>
                            Não compartilharemos informações com terceiros sem
                            sua autorização
                          </li>
                          <li>
                            Você tem acesso aos dados de reservas e relatórios
                            de uso
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="terms"
                    rules={{
                      required:
                        "Você precisa aceitar os termos para continuar.",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <label className="flex items-start gap-3 cursor-pointer mb-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                          </FormControl>
                          <span className="text-sm text-gray-700">
                            Li e concordo com todos os termos e condições acima.
                            Estou ciente das minhas responsabilidades como
                            proprietário de arena na plataforma Arena Manager.
                          </span>
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button onClick={() => navigate("/")} variant="outline">
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!isStepValid()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Nome da Arena
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Escolha um nome atrativo para sua arena. Este será o nome
                    que os clientes verão ao procurar por locais para jogar.
                  </p>

                  <div className="space-y-4 mb-6">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Informe o nome da arena." }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome da Arena{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Arena Sports Center"
                              className="mt-2"
                              autoFocus
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Dica: Use um nome fácil de lembrar e que represente
                            sua arena
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button onClick={() => setStep(1)} variant="outline">
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!isStepValid()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Localização
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Informe a cidade onde sua arena está localizada. Isso
                    ajudará os clientes a encontrarem sua arena mais facilmente.
                  </p>

                  <div className="space-y-4 mb-6">
                    <FormField
                      control={form.control}
                      name="city"
                      rules={{ required: "Informe a cidade da arena." }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cidade <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: São Paulo"
                              className="mt-2"
                              autoFocus
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Digite apenas o nome da cidade
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button onClick={() => setStep(2)} variant="outline">
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setStep(4)}
                      disabled={!isStepValid()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Endereço Completo
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Forneça o endereço completo da sua arena. Isso é essencial
                    para que os clientes possam localizar e visitar sua arena.
                  </p>

                  <div className="space-y-4 mb-6">
                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Informe o endereço completo." }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Endereço <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Rua das Flores, 123 - Centro"
                              className="mt-2"
                              autoFocus
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Inclua rua, número, bairro e complemento se
                            necessário
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button
                      onClick={() => setStep(3)}
                      variant="outline"
                      disabled={isPending}
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handleCreateArena}
                      disabled={!isStepValid() || isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isPending ? "Criando..." : "Criar Arena"}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Após criar sua primeira arena, você terá acesso ao{" "}
              <strong>Painel do Proprietário</strong> onde poderá gerenciar suas
              quadras, horários e visualizar relatórios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

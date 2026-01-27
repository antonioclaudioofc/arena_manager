import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { ArrowLeft, Building2 } from "lucide-react";
import logo from "../assets/logo.svg";
import { Button } from "../components/Button";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      client: "Cliente",
      owner: "Proprietário de Arena",
      admin: "Administrador",
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        style={{ backgroundColor: "var(--brand-700)" }}
        className=" from-green-700 to-green-800 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 max-md:p-0 hover:bg-green-600 rounded-lg transition-colors text-white cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft size={24} />
            </button>
            <a
              href="/"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="Logo" className="h-12 w-auto" />
            </a>
          </div>
          <h1 className="text-2xl font-bold text-white max-md:text-lg">
            Meu Perfil
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {user && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-wrap max-md:justify-center max-md:text-center items-center gap-6 mb-6">
              <div
                style={{ backgroundColor: "var(--brand-700)" }}
                className="w-24 h-24 rounded-full from-green-600 to-green-700 flex items-center justify-center text-white text-4xl font-bold shrink-0"
              >
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 max-md:text-xl">
                  {user.name}
                </h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 max-md:text-lg">
            Sobre sua Conta
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">E-mail</p>
              <p className="text-lg font-medium text-gray-900 max-md:text-base">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="text-lg font-medium text-gray-900 max-md:text-base">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-lg font-medium text-gray-900 max-md:text-base">
                {user?.username}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Conta</p>
              <p className="text-lg font-medium text-gray-900 max-md:text-base">
                {getRoleName(user?.role)}
              </p>
            </div>
          </div>
        </div>

        {/* Seção para se tornar proprietário */}
        {user?.role === "client" && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md p-8 border border-green-200">
            <div className="flex items-start gap-4 max-md:flex-col max-md:items-center max-md:text-center">
              <div className="bg-green-600 p-4 rounded-full shrink-0">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tem uma arena esportiva?
                </h3>
                <p className="text-gray-700 mb-4">
                  Torne-se um proprietário e comece a gerenciar suas arenas,
                  quadras e horários. É simples e rápido!
                </p>
                <Button
                  onClick={() => navigate("/owner/arenas")}
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-5 w-5" />
                  Cadastrar Minha Arena
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Acesso ao painel para owners */}
        {user?.role === "owner" && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md p-8 border border-green-200">
            <div className="flex items-start gap-4 max-md:flex-col max-md:items-center max-md:text-center">
              <div className="bg-green-600 p-4 rounded-full shrink-0">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Painel do Proprietário
                </h3>
                <p className="text-gray-700 mb-4">
                  Acesse seu painel para gerenciar arenas, quadras e horários
                </p>
                <Button
                  onClick={() => navigate("/owner")}
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-5 w-5" />
                  Acessar Painel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

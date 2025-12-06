import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.svg";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-green-600 rounded-lg transition-colors text-white cursor-pointer"
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
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {user && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-4xl font-bold shrink-0">
                {user.first_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.first_name}
                </h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Sobre sua Conta
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">E-mail</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="text-lg font-medium text-gray-900">
                {user?.first_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

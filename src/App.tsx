import Home from "./pages/Home";
import logo from "./assets/logo.svg";
import { Button } from "./components/Button";
import { Avatar, AvatarImage, AvatarFallback } from "./components/Avatar";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router";
import { ChevronDown, CircleUserRound, LogOut, Volleyball } from "lucide-react";

export default function App() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };
  

  return (
    <div className="min-h-screen w-full bg-gray-200">
      <div
        style={{ backgroundColor: "var(--brand-700)" }}
        className="p-4 shadow-md"
      >
        <header className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 object-fill shadow-sm"
            />
            <h1
              onClick={() => navigate("/")}
              className="text-white font-semibold text-xl cursor-pointer hover:text-gray-300 transition-colors"
            >
              Arena Manager
            </h1>
          </div>

          {auth.user?.id ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 text-white cursor-pointer transition-all hover:opacity-80"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start">
                  <h5 className="font-medium text-white">
                    {auth.user.first_name}
                  </h5>
                  <p className="text-xs text-gray-300">{auth.user.email}</p>
                </div>

                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <ul className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl text-gray-800 overflow-hidden animate-fadeIn z-50 border border-gray-200">
                  <li>
                    <a
                      href="/user/profile"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <CircleUserRound className="h-4 w-4 text-gray-500" />
                      Perfil
                    </a>
                  </li>

                  <li>
                    <a
                      href="/reservas"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Volleyball className="h-4 w-4 text-gray-500" />
                      Minhas Reservas
                    </a>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4  text-red-500" />
                      Sair
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            // MENU QUANDO NÃO ESTIVER LOGADO
            <div className="flex items-center gap-3">
              <a href="/login">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-100"
                >
                  Entrar
                </Button>
              </a>
            </div>
          )}
        </header>
      </div>

      <main className="max-w-7xl mx-auto mt-6 p-4">
        <Home />
      </main>
    </div>
  );
}

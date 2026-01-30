import Home from "./pages/Home";
import logo from "./assets/logo.svg";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router";
import {
  LogOut,
  Building2,
  CircleUserRound,
  Volleyball,
  ChevronDown,
} from "lucide-react";
import { Button } from "./components/Button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/Avatar";

export default function App() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform  duration-300 shadow-lg bg-white border-b border-gray-200 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl p-6 mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 transition hover:opacity-80 cursor-pointer"
            >
              <img src={logo} alt="Arena Manager" className="w-12 h-12" />
              <div className="hidden sm:block">
                <h2 className="font-bold text-lg text-emerald-600">
                  Arena Manager
                </h2>
                <p className="text-xs text-gray-500">
                  Sua plataforma esportiva
                </p>
              </div>
            </button>

            {(auth.user?.role === "owner" || auth.user?.role === "admin") && (
              <Button
                onClick={() => navigate("/owner")}
                className="flex items-center gap-2 w-max"
              >
                <Building2 size={18} />
                <span className="hidden sm:inline">Gerenciar</span>
              </Button>
            )}

            <div className="flex items-center gap-3">
              {auth.user ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setIsOpenDropdown((v) => !v)}
                      className="flex items-center gap-3 text-white cursor-pointer transition-all hover:opacity-80"
                      aria-haspopup="true"
                      aria-expanded={isOpenDropdown}
                    >
                      <Avatar className="border border-gray-400">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col items-start">
                        <h5 className="font-medium text-gray-800">
                          {auth.user.name}
                        </h5>
                        <p className="text-xs text-gray-500  max-md:hidden">
                          {auth.user.email}
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 text-black transition-transform ${
                          isOpenDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpenDropdown && (
                      <ul className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl text-gray-800 overflow-hidden animate-fadeIn z-50 border border-gray-200">
                        <li>
                          <a
                            href="/user/profile"
                            onClick={() => setIsOpenDropdown(false)}
                            className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <CircleUserRound className="h-4 w-4 text-gray-500" />
                            Perfil
                          </a>
                        </li>

                        <li>
                          <a
                            href="/user/reservations"
                            onClick={() => setIsOpenDropdown(false)}
                            className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
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
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    variant="outline"
                  >
                    Entrar
                  </Button>
                  <Button onClick={() => navigate("/register")}>
                    Criar Conta
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <Home />
      </main>
    </div>
  );
}

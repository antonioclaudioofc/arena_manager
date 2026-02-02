import Home from "./pages/Home";
import logo from "./assets/logo.svg";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./providers/AuthProvider";
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
import { useUserReservations } from "./hooks/use-reservation";
import { capitalizeWords } from "./utils/capitalizeWords";

export default function App() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch reservations only if user is authenticated
  const { data: reservations = [] } = useUserReservations();

  // Show reservations link if user is client OR if owner/admin has reservations
  const showReservationsLink =
    auth.user?.role === "client" || (auth.user && reservations.length > 0);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
    };

    if (isOpenDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenDropdown]);

  if (auth.loading) {
    return null;
  }

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-lg bg-white border-b border-gray-200 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl p-6 mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 transition hover:opacity-80"
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

            <div className="flex items-center gap-4">
              {(auth.user?.role === "owner" || auth.user?.role === "admin") && (
                <Button
                  onClick={() => navigate("/owner")}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Building2 size={18} />
                  <span className="hidden sm:inline">Gerenciar</span>
                </Button>
              )}

              <div className="flex items-center gap-3">
                {auth.user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsOpenDropdown((v) => !v)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Avatar className="border border-gray-400">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>{auth.user.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col items-start">
                        <h5 className="font-medium text-gray-800">
                          {capitalizeWords(auth.user.name)}
                        </h5>
                        <p className="text-xs text-gray-500 max-md:hidden">
                          {auth.user.email}
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          isOpenDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpenDropdown && (
                      <ul className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                        <li>
                          <button
                            onClick={() => {
                              navigate("/user/profile");
                              setIsOpenDropdown(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            <CircleUserRound className="h-5 w-5" />
                            <span className="font-medium">Perfil</span>
                          </button>
                        </li>
                        {showReservationsLink && (
                          <li>
                            <button
                              onClick={() => {
                                navigate("/user/reservations");
                                setIsOpenDropdown(false);
                              }}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                              <Volleyball className="h-5 w-5" />
                              <span className="font-medium">
                                Minhas Reservas
                              </span>
                            </button>
                          </li>
                        )}

                        <li className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate("/login")}
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
        </div>
      </nav>

      <main className="pt-16">
        <Home />
      </main>
    </div>
  );
}

import Home from "./pages/Home";
import logo from "./assets/logo.svg";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router";
import { LogOut, Building2, User } from "lucide-react";
import { Button } from "./components/Button";

export default function App() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-lg bg-white border-b border-gray-200 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3">
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

            <div className="flex items-center gap-3">
              {auth.user ? (
                <>
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="outline"
                    size="default"
                    className="flex items-center gap-2 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">
                      {auth.user.name || auth.user.username}
                    </span>
                  </Button>

                  {(auth.user.role === "owner" ||
                    auth.user.role === "admin") && (
                    <Button
                      onClick={() => navigate("/owner")}
                      variant="default"
                      size="default"
                      className="flex items-center gap-2"
                    >
                      <Building2 size={18} />
                      <span className="hidden sm:inline">Gerenciar</span>
                    </Button>
                  )}

                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                    title="Sair"
                  >
                    <LogOut size={20} />
                  </Button>
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

import Home from "./pages/Home";
import logo from "./assets/logo.svg";
import { Button } from "./components/Button";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-200">
      <div style={{ backgroundColor: "var(--brand-700)" }} className="p-4">
        <header className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12">
              <img
                src={logo}
                alt="Icon da logo"
                className="w-full h-full object-fill"
              />
            </div>
            <h1 className="text-white font-semibold cursor-pointer hover:text-gray-400 transition-all">
              Arena Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a href="/login">
              <Button variant={"outline"}>Entrar</Button>
            </a>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto mt-6 p-4">
        <Home />
      </main>
    </div>
  );
}

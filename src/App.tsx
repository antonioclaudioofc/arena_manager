import { Button } from "./components/button";
import Home from "./pages/Home";
import logo from "./assets/logo.svg";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-200">
      <div className="bg-green-800 p-6">
        <header className="max-w-7xl mx-auto flex justify-between items-center ">
          <div className="h-16 w-16">
            <img
              src={logo}
              alt="Icon da logo"
              className="w-full h-full object-fill"
            />
          </div>
          <Button variant={"outline"}>Entrar</Button>
        </header>
      </div>
      <main className="max-w-7xl mx-auto">
        <Home />
      </main>
    </div>
  );
}

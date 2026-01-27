import { OwnerSidebar } from "../components/OwnerSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <OwnerSidebar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-gray-600 hover:text-green-600 hover:bg-green-50 p-3 rounded-lg transition-colors " />
            <h1 className="text-xl font-semibold text-gray-800 max-lg:hidden">
              Painel do Proprietário
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 cursor-pointer font-medium whitespace-nowrap shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} />
            Voltar para Mural
          </button>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

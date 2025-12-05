import { AppSidebar } from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
          <SidebarTrigger className="text-gray-600 hover:text-green-600 hover:bg-green-50 p-3 rounded-lg transition-colors " />
          <h1 className="text-xl font-semibold text-gray-800">
            Painel Administrativo
          </h1>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

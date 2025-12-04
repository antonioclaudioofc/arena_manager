import { AppSidebar } from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

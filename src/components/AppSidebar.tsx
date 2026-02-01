import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Settings,
  Trophy,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import logo from "../assets/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar";
import { AuthContext } from "../providers/AuthProvider";

const adminItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quadras",
    url: "/admin/courts",
    icon: Trophy,
  },
  {
    title: "Horários",
    url: "/admin/schedules",
    icon: CalendarDays,
  },
  {
    title: "Reservas",
    url: "/admin/reservations",
    icon: ClipboardList,
  },
  {
    title: "Usuários",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/admin/config",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-gray-200 from-green-50 to-white flex flex-col">
      <SidebarContent className="flex-1">
        <div className="px-6 py-6 border-b border-green-200 flex flex-col items-center">
          <img src={logo} alt="Arena Manager" className="w-20 h-20" />
          <h2 className="text-lg font-bold text-green-800 text-center">
            Arena Manager
          </h2>
        </div>

        <SidebarGroup className="pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-3">
              {adminItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg transition-all ${
                        isActive
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                      }`}
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-4 px-5 py-5"
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="font-medium text-base">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <div className="px-6 py-5 border-b border-green-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
              <p className="text-gray-500 text-xs truncate w-full">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="px-3 py-4 border-t border-green-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-base cursor-pointer"
        >
          <LogOut className="h-6 w-6" />
          <span>Sair</span>
        </button>
      </div>
    </Sidebar>
  );
}

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Settings,
  Trophy,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar";

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
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold px-4 py-2">
            Administração
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

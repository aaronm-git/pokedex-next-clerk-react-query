import { Home, Search, Zap, Gamepad2, User } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/Sidebar";
import QueryProvider from "@/components/providers/QueryProvider";

// Navigation items for the sidebar
const navigationItems = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: Home,
  },
  {
    title: "Pokemon Search",
    url: "/app/pokemon-search",
    icon: Search,
  },
  {
    title: "My Pokemon",
    url: "/app/pokemon",
    icon: Zap,
  },
  {
    title: "My Games",
    url: "/app/games",
    icon: Gamepad2,
  },
  {
    title: "My Trainer Profile",
    url: "/app/profile",
    icon: User,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar navigationItems={navigationItems} />
          <SidebarInset className="flex-1">
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </QueryProvider>
  );
}

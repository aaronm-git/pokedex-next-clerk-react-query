import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Gamepad2, Heart, Home, Search, User, Zap } from "lucide-react";
import { AppSidebar } from "@/components/app/Sidebar";
import QueryProvider from "@/components/providers/QueryProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
    title: "My Favorites",
    url: "/app/favorites",
    icon: Heart,
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
            <main className="flex-1 p-4 max-h-screen">{children}</main>
          </SidebarInset>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </SidebarProvider>
    </QueryProvider>
  );
}

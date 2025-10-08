import { LayoutDashboard } from "lucide-react";
import DashboardFavorites from "@/components/app/DashboardFavorites";
import DashboardStats from "@/components/app/DashboardStats";
import DashboardTopPokemon from "@/components/app/DashboardTopPokemon";
import DashboardTypeDistribution from "@/components/app/DashboardTypeDistribution";
import { Separator } from "@/components/ui/separator";

export default function page() {
  return (
    <div className="space-y-6">
      <header className="">
        <h1 className="text-lg font-bold flex items-center gap-2 h-11">
          <LayoutDashboard className="size-6" />
          Dashboard
        </h1>
        <Separator className="my-2" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <DashboardStats />
          <DashboardFavorites />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <DashboardTypeDistribution />
          <DashboardTopPokemon />
        </div>
      </div>
    </div>
  );
}

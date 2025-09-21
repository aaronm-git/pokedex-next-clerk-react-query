import { Separator } from "@/components/ui/separator";
import { LayoutDashboard } from "lucide-react";

export default function page() {
  return (
    <header className="">
      <h1 className="text-lg font-bold flex items-center gap-2 h-11">
        <LayoutDashboard className="size-6" />
        Dashboard
      </h1>
      <Separator className="my-2" />
    </header>
  );
}

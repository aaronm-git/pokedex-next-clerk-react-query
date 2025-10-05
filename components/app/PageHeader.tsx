import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { Separator } from "@/components/ui/separator";

export default function PageHeader({
  title,
  IconComponent,
}: {
  title: string;
  IconComponent: LucideIcon | IconType;
}) {
  return (
    <header className="">
      <h1 className="text-lg font-bold flex items-center gap-2 h-11 capitalize">
        <IconComponent className="size-6" />
        {title}
      </h1>
      <Separator className="my-2" />
    </header>
  );
}

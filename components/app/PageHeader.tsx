import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { Separator } from "@/components/ui/separator";

export default function PageHeader({
  title,
  IconComponent,
  ButtonGroup,
}: {
  title: string;
  IconComponent: LucideIcon | IconType;
  ButtonGroup?: React.ReactNode;
}) {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2 h-11 capitalize">
          <IconComponent className="size-6" />
          {title}
        </h1>
        <Separator className="my-2" />
      </div>
      <div>{ButtonGroup}</div>
    </header>
  );
}

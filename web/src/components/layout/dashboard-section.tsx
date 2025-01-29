import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  info?: string;
  children?: React.ReactNode;
}
function DashboardSection({ title, description, info, children }: DashboardSectionProps) {
  return (
    <div className="flex border-b  flex-1 flex-col h-auto max-h-max py-8   md:flex">
      <div className="container flex justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <div className="flex items-center space-x-2 ">
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
            {info && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge>
                      <Info className="h-4 w-4" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>{info}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default DashboardSection;
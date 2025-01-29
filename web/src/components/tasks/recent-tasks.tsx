"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { intlFormatDistanceNow } from "@/lib/format";
import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Task } from "@/types";

interface RecentOrdersProps {
  data: Task[];
}
function TasksRecents({ data }: RecentOrdersProps) {
  if (data.length === 0) {
    return (
      <div className="mt-20 flex h-full  w-full flex-col items-center justify-center">
        <PackageOpen size={16} />
        <p>Sin tareas recientes</p>
      </div>
    );
  }

  return (
    <div className="relative grid max-h-[380px] gap-8 overflow-hidden ">
      {data.map(({ _id,description,title,date }) => (
        <div key={_id} className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/shapes/svg?seed=${title}`}
              alt={`Tarea-${title}`}
            />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <div suppressHydrationWarning className="ml-auto text-sm font-medium">
            {intlFormatDistanceNow(date)}
          </div>
        </div>
      ))}
      {data.length > 6 && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center rounded-b bg-gradient-to-t from-background to-transparent py-7">
          <Link
            to="/dashboard/invoices/success"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              })
            )}
          >
            Ver todas las tareas
          </Link>
        </div>
      )}
    </div>
  );
}

export default TasksRecents;

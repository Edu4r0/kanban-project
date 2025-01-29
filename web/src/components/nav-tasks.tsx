import {
  MoreHorizontal,
  Trash2,
  LinkIcon,
  Pencil,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import CreateTask from "@/components/tasks/create-task";
import { Link } from "react-router-dom";
import { Task } from "@/types";
import DeleteTask from "./tasks/delete-task";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { toast } from "@pheralb/toast";
import EditTask from "./tasks/edit-task";

const MAX_TASKS = 10;

interface NavTasksProps {
  tasks: Task[];
}

export function NavTasksSkeleton() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tareas</SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavTasks({ tasks }: NavTasksProps) {
  const { isMobile } = useSidebar();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copy] = useCopyToClipboard();

  const handleCopy = async (url: string) => {
    try {
      copy(url)
        .then(() => {
          toast.success({
            text: "¡Copiado!",
            description: "El enlace ha sido copiado al portapapeles: ",
          });
        })
        .catch((error) => {
          toast.error({
            text: "Ha ocurrido un error inesperado. Inténtelo de nuevo más tarde.",
            description: error.message,
          });
        });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tareas</SidebarGroupLabel>
      <SidebarMenu>
        {tasks.slice(0, MAX_TASKS).map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link to={`/dashboard/tasks?id=${item._id}`}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => handleCopy(`/dashboard/tasks?id=${item._id}`)}
                >
                  <LinkIcon className="text-muted-foreground" />
                  <span>Copiar enlace</span>
                </DropdownMenuItem>
                <EditTask
                  _id={item._id}
                  title={item.title}
                  status={item.status}
                  description={item.description || ""}
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="text-muted-foreground" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                </EditTask>
                <DropdownMenuSeparator />

                <DeleteTask id={item._id}>
                  {/*
                    BUG: Close dialog in dropdown menu
                    use onSelect to prevent default behaviour
                  */}
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Borrar</span>
                  </DropdownMenuItem>
                </DeleteTask>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <CreateTask>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>✨ Crear nueva tarea</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </CreateTask>
        <Link to="/dashboard/tasks">
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>Ver todas las tareas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}

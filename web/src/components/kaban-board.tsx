import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Flame, Pencil } from "lucide-react";
import CreateTask from "./tasks/create-task";
import { Button, buttonVariants } from "./ui/button";
import { taskStatus } from "@/lib/shemas";
import { useTasks } from "@/context/tasks-context";
import { Task } from "@/types";
import EditTask from "@/components/tasks/edit-task";
import { MoreHorizontal, Trash2, LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTask from "./tasks/delete-task";
import { useSidebar } from "./ui/sidebar";
import { toast } from "@pheralb/toast";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";

export const KanbanBoard: React.FC = () => {
  return <Board />;
};

const Board: React.FC = () => {
  const { tasks, deleteTask } = useTasks();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7 ">
      <Column
        title="En espera"
        column="backlog"
        headingColor="text-neutral-500"
        cards={tasks}
      />

      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-500"
        cards={tasks}
      />
      <Column
        title="En progreso"
        column="in progress"
        headingColor="text-blue-500"
        cards={tasks}
      />
      <Column
        title="Completadas"
        column="done"
        headingColor="text-emerald-500"
        cards={tasks}
      />
      <Column
        title="Canceladas"
        column="canceled"
        headingColor="text-red-500"
        cards={tasks}
      />
      <BurnBarrel setCards={(taskId: string) => deleteTask(taskId)} />
    </div>
  );
};

interface ColumnProps {
  title: string;
  headingColor: string;
  cards: Task[];
  column: Task["status"];
}

const Column: React.FC<ColumnProps> = ({
  title,
  headingColor,
  cards,
  column,
}) => {
  const { updateTaskOptimistic } = useTasks();
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Task) => {
    e.dataTransfer.setData("cardId", card._id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c._id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, status: column };

      copy = copy.filter((c) => c._id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el._id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      updateTaskOptimistic(cardId, { status: column });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights(getIndicators());
    setActive(false);
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    card: Task
  ) => {
    e.preventDefault();
    handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, card);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragEnd(e as unknown as React.DragEvent<HTMLDivElement>);
  };

  const filteredCards = cards.filter((c) => c.status === column);

  return (
    <div
      className="w-full sm:w-72 lg:w-56 shrink-0"
      onTouchStart={(e) => handleTouchStart(e, filteredCards[0])}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-muted/50" : "bg-muted-800/0"
        }`}
      >
        {filteredCards.map((c) => (
          <Card
            column={column}
            key={c._id}
            id={c._id}
            {...c}
            date={c.date}
            handleDragStart={handleDragStart}
            description={c.description || ""}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />

        <CreateTask status={taskStatus.parse(column)}>
          <motion.button
            layout
            className={buttonVariants({
              variant: "outline",
              className:
                "flex w-full items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ",
            })}
          >
            <span>Agregar tarea</span>
            <PlusIcon />
          </motion.button>
        </CreateTask>
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  id: string;
  column: Task["status"];
  description: string;
  date: Date;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, card: Task) => void;
}

const Card: React.FC<CardProps> = ({
  title,
  id,
  column,
  handleDragStart,
  description,
  date,
}) => {
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
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handleDragStart(e as any, {
            title,
            _id: id,
            status: column,
            date,
            description,
          })
        }
        className="cursor-grab   rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing group"
      >
        <div className=" flex justify-between">
          <p className="text-sm text-neutral-100 w-full truncate">{title}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-2 h-2 p-[0.6rem] transition-opacity opacity-0 group-hover:opacity-100">
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem
                onClick={() => handleCopy(`/dashboard/tasks?id=${id}`)}
              >
                <LinkIcon className="text-muted-foreground" />
                <span>Copiar enlace</span>
              </DropdownMenuItem>

              <EditTask
                _id={id}
                title={title}
                status={column}
                description={description}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="text-muted-foreground" />
                  <span>Editar</span>
                </DropdownMenuItem>
              </EditTask>

              <DropdownMenuSeparator />

              <DeleteTask id={id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Borrar</span>
                </DropdownMenuItem>
              </DeleteTask>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </>
  );
};

interface DropIndicatorProps {
  beforeId: string | null;
  column: Task["status"];
}

const DropIndicator: React.FC<DropIndicatorProps> = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

interface BurnBarrelProps {
  setCards: (taskId: string) => void;
}

const BurnBarrel: React.FC<BurnBarrelProps> = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards(cardId);
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? (
        <Flame className="animate-bounce size-10" />
      ) : (
        <TrashIcon className="size-10" />
      )}
    </div>
  );
};

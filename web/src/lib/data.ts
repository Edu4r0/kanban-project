import {
    CircleIcon,
    CheckCircledIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons";

export const statuses = [
    {
      value: "backlog",
      label: "Reservada",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: "todo",
      label: "Todo",
      icon: CircleIcon,
    },
    {
      value: "in progress",
      label: "En Progreso",
      icon: StopwatchIcon,
    },
    {
      value: "done",
      label: "Completada",
      icon: CheckCircledIcon,
    },
    {
      value: "canceled",
      label: "Cancelada",
      icon: CrossCircledIcon,
    },
  ];
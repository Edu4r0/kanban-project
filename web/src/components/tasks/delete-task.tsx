import { useTasks } from "@/context/tasks-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { deleteTaskSchema } from "@/lib/shemas";
import { Input } from "@/components/ui/input";
import { toast } from "@pheralb/toast";
import { type z } from "zod";

interface DeleteTaskProps {
  children: ReactNode;
  id: string;
}
function DeleteTask({ children, id }: DeleteTaskProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteTask } = useTasks();

  const form = useForm({
    resolver: zodResolver(deleteTaskSchema),
    defaultValues: {
      _id: id,
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof deleteTaskSchema>) {
    try {
      if (values.text !== "borrar") {
        toast.error({
          text: "La palabra no es correcta",
          icon: "😕",
        });
        return;
      }
      setLoading(true);
      const result = await deleteTask(values._id);
      if (!result || !result.success) {
        toast.error({
          text: result.message,
          icon: "😕",
        });
      }

      if (result.success) {
        toast.success({
          text: "Tarea borrada exitosamente",
          icon: "🎉",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error({
        text: "Error al borrar la tarea, intentalo de nuevo",
        action: {
          text: "Intentalo de nuevo",
          onClick: () => {
            form.reset();
          },
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elminar tarea</DialogTitle>
          <DialogDescription className="text-red-500 dark:text-red-400">
            Esta acción es irreversible. Por favor, escriba la palabra "borrar"
            para confirmar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Escriba <span className="font-mono font-bold">borrar</span>{" "}
                    para confirmar:
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" loading={loading} type="submit">
                Eliminar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTask;

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { taskStatus, updateTaskSchema } from "@/lib/shemas";
import { Input } from "@/components/ui/input";
import { toast } from "@pheralb/toast";
import { type z } from "zod";
import { Textarea } from "../ui/textarea";
import { statuses } from "@/lib/data";

interface EditTaskProps {
  _id: string;
  title: string;
  description: string;
  status: z.infer<typeof taskStatus>;
  children: ReactNode;
}
function EditTask({
  _id,
  title,
  description,
  status,
  children,
}: EditTaskProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateTask } = useTasks();

  const form = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      _id,
      title,
      status,
      description,
    },
  });

  async function onSubmit(values: z.infer<typeof updateTaskSchema>) {
    try {
      setLoading(true);
      const result = await updateTask(values);
      if (!result || !result.success) {
        toast.error({
          text: result.message,
          icon: "😕",
        });
      }

      if (result.success) {
        toast.success({
          text: "Tarea editada exitosamente",
          icon: "🎉",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error({
        text: "Error al crear la tarea, intentalo de nuevo",
        action: {
          text: "Intentalo de nuevo",
          onClick: () => {
            form.reset();
          },
        },
      });
    } finally {
      setLoading(false);
      setOpen(false);
      form.reset();
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
          <DialogDescription>Edita la tarea para tu proyecto</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 "
          >
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input
                        id="title"
                        type="text"
                        placeholder="🌱 Regar las plantas"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map(({ label, value, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Esta es la clasificacion de la falla: neumatica, mecanica,
                    etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe aquí los detalles de la tarea..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Proporciona una descripción clara y concisa de la tarea.
                      Esto ayudará a entender mejor lo que se necesita hacer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cerrar
                </Button>
              </DialogClose>
              <Button loading={loading} type="submit">
                Guardar tarea
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTask;

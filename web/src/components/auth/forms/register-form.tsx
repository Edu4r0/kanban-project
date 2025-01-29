import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import placeholder from "@/assets/placeholder.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { z } from "@/lib/es-zod";
import { authRegisterSchema } from "@/lib/shemas";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { toast } from "@pheralb/toast";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signup } = useAuth();

  const form = useForm<z.infer<typeof authRegisterSchema>>({
    resolver: zodResolver(authRegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authRegisterSchema>) {
    const result = await signup(values);
    if (!result || !result.success) {
      toast.error({
        text: result?.message || "Error inesperado, intenta de nuevo",
        icon: "😭",
      });
    }

    if (result?.success) {
      toast.success({
        text: result?.message,
        icon: "🎉",
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Registrarse</h1>
                  <p className="text-balance text-muted-foreground">
                    Ingresa tus datos para crear una cuenta
                  </p>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de usuario</FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            placeholder="John Doe"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>

                        <FormControl>
                          <PasswordInput {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirma tu contraseña</FormLabel>

                        <FormControl>
                          <PasswordInput {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Registrarse
                </Button>

                <div className="text-center text-sm">
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/auth" className="underline underline-offset-4">
                    Inicia sesión
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={placeholder}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

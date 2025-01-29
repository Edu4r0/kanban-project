import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  const domain = window.location.host;
  return (
    <main className="min-h-dvh flex justify-center items-center">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 font-mono text-6xl font-bold tracking-tight lg:text-7xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-medium tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Pagina no encontrada
          </p>
          <p className="mb-4 font-mono text-sm font-light text-gray-500 dark:text-gray-400">
            {`
                        La página que estás buscando no existe en
                        ${domain}.`}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Link className={buttonVariants({ variant: "outline" })} to="/">
              <HomeIcon size={18} />
              <span>Ir al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;

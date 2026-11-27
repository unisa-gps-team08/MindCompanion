import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Ingresso dell'intestazione, una sola volta. Si muove solo la posizione, non l'opacità: se il
// browser sospende le animazioni il testo resta visibile. Niente animazione per chi l'ha disattivata.
export const INGRESSO =
  "animate-in slide-in-from-bottom-3 duration-700 ease-[cubic-bezier(.22,1,.36,1)] [animation-fill-mode:both] motion-reduce:animate-none";

type IntestazionePaginaProps = {
  titolo: string;
  descrizione?: ReactNode;
  indietro?: { href: string; etichetta: string };
  className?: string;
};

// Intestazione comune delle pagine: link per tornare indietro, titolo e descrizione.
export function IntestazionePagina({ titolo, descrizione, indietro, className }: IntestazionePaginaProps) {
  return (
    <header className={cn("flex flex-col gap-5", className)}>
      {indietro && (
        <Link
          href={indietro.href}
          className="group inline-flex w-fit items-center gap-2 rounded-md py-1 text-base font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <ArrowLeftIcon
            aria-hidden="true"
            className="size-5 transition-transform duration-150 group-hover:-translate-x-[3px]"
          />
          {indietro.etichetta}
        </Link>
      )}
      <div className="flex flex-col gap-2">
        <h1 className={cn(INGRESSO, "text-4xl tracking-[-0.02em]")}>{titolo}</h1>
        {descrizione && (
          <p className={cn(INGRESSO, "text-lg text-muted-foreground [animation-delay:150ms]")}>{descrizione}</p>
        )}
      </div>
    </header>
  );
}

import type { ReactNode } from "react";
import { BrainIcon } from "lucide-react";
import { INGRESSO } from "@/components/IntestazionePagina";
import { cn } from "@/lib/utils";

type SchedaAccessoProps = { titolo: string; descrizione?: ReactNode; children: ReactNode };

// Scheda centrata con il marchio, per le pagine fuori dalle aree riservate (login, cambio password).
export function SchedaAccesso({ titolo, descrizione, children }: SchedaAccessoProps) {
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-md flex-col gap-8 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BrainIcon aria-hidden="true" className="size-5" />
            </span>
            <span className="text-lg font-semibold text-primary">MindCompanion</span>
          </div>
          <h1 className={cn(INGRESSO, "text-3xl tracking-[-0.02em]")}>{titolo}</h1>
          {descrizione && (
            <p className={cn(INGRESSO, "text-lg text-muted-foreground [animation-delay:150ms]")}>{descrizione}</p>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}

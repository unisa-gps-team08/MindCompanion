import type { ReactNode } from "react";
import { IntestazionePagina } from "@/components/IntestazionePagina";

// Segnaposto per aree e sezioni non ancora implementate: usa <section> dentro LayoutAreaRiservata.
export function AreaProvvisoria({ titolo, children }: { titolo: string; children?: ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 py-2 sm:py-4">
      <IntestazionePagina
        titolo={titolo}
        descrizione={children ? undefined : "Accesso effettuato. Le funzioni di questa sezione arriveranno con i prossimi task."}
      />
      {children}
    </section>
  );
}

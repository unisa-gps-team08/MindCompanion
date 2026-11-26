import type { ReactNode } from "react";

// Segnaposto per aree e sezioni non ancora implementate: usa <section> dentro LayoutAreaRiservata.
export function AreaProvvisoria({ titolo, children }: { titolo: string; children?: ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold">{titolo}</h1>
      {children ?? (
        <p className="text-lg">
          Accesso effettuato. Le funzioni di questa sezione arriveranno con i prossimi task.
        </p>
      )}
    </section>
  );
}

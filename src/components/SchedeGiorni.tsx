"use client";

import { useRef, type KeyboardEvent } from "react";
import { ETICHETTE_GIORNO, GIORNI_SETTIMANA, type GiornoSettimana } from "@/lib/pianoAlimentare";

type SchedeGiorniProps = {
  idPannello: string;
  giornoAttivo: GiornoSettimana;
  /** Pasti compilati per giorno, mostrati accanto al nome. */
  pastiPerGiorno: Record<GiornoSettimana, number>;
  /** Giorni da segnalare con un pallino rosso (solo nel form). */
  giorniConErrori?: ReadonlySet<GiornoSettimana>;
  onSeleziona: (giorno: GiornoSettimana) => void;
};

export function idScheda(giorno: GiornoSettimana): string {
  return `scheda-${giorno}`;
}

// Schede dei giorni della settimana (UI_NT_1). Tastiera come da pattern ARIA delle tab:
// frecce per spostarsi, Home e Fine per il primo e l'ultimo giorno.
export function SchedeGiorni({
  idPannello,
  giornoAttivo,
  pastiPerGiorno,
  giorniConErrori,
  onSeleziona,
}: SchedeGiorniProps) {
  const schede = useRef<Partial<Record<GiornoSettimana, HTMLButtonElement | null>>>({});

  function vaiA(indice: number) {
    const giorno = GIORNI_SETTIMANA[(indice + GIORNI_SETTIMANA.length) % GIORNI_SETTIMANA.length];
    onSeleziona(giorno);
    schede.current[giorno]?.focus();
  }

  function gestisciTasto(evento: KeyboardEvent<HTMLDivElement>) {
    const indice = GIORNI_SETTIMANA.indexOf(giornoAttivo);
    const azioni: Record<string, number> = {
      ArrowRight: indice + 1,
      ArrowLeft: indice - 1,
      Home: 0,
      End: GIORNI_SETTIMANA.length - 1,
    };
    if (!(evento.key in azioni)) return;
    evento.preventDefault();
    vaiA(azioni[evento.key]);
  }

  return (
    <div
      role="tablist"
      aria-label="Giorni della settimana"
      onKeyDown={gestisciTasto}
      // contain:inline-size: la larghezza delle schede non allarga la pagina; se non entrano
      // scorrono dentro la barra.
      className="flex gap-1 overflow-x-auto overflow-y-hidden border-b [contain:inline-size]"
    >
      {GIORNI_SETTIMANA.map((giorno) => {
        const attivo = giorno === giornoAttivo;
        const pasti = pastiPerGiorno[giorno];
        const conErrori = giorniConErrori?.has(giorno) ?? false;
        return (
          <button
            key={giorno}
            ref={(elemento) => {
              schede.current[giorno] = elemento;
            }}
            id={idScheda(giorno)}
            type="button"
            role="tab"
            aria-selected={attivo}
            aria-controls={idPannello}
            tabIndex={attivo ? 0 : -1}
            onClick={() => onSeleziona(giorno)}
            className="-mb-px flex min-h-11 shrink-0 items-center gap-2 border-b-2 border-transparent px-4 text-base text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-selected:border-foreground aria-selected:font-semibold aria-selected:text-foreground"
          >
            {ETICHETTE_GIORNO[giorno]}
            {pasti > 0 && (
              <span className="rounded-full bg-muted px-2 text-sm text-foreground">
                {pasti}
                <span className="sr-only">{pasti === 1 ? " pasto compilato" : " pasti compilati"}</span>
              </span>
            )}
            {conErrori && (
              <span className="size-2 rounded-full bg-destructive">
                <span className="sr-only">, contiene errori</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

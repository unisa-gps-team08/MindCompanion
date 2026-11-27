"use client";

import { MAX_LUNGHEZZA_RACCOMANDAZIONI, type ErroriPianoAlimentare } from "@/lib/validazionePianoAlimentare";

export type Raccomandazione = "raccomandazioniIdriche" | "raccomandazioniNutrizionali";

const CAMPI: readonly (readonly [Raccomandazione, string])[] = [
  ["raccomandazioniIdriche", "Raccomandazioni idriche"],
  ["raccomandazioniNutrizionali", "Raccomandazioni nutrizionali"],
];

const CLASSI_TESTO =
  "min-h-24 rounded-lg border bg-background px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

type RaccomandazioniPianoProps = {
  valori: Record<Raccomandazione, string>;
  errori: ErroriPianoAlimentare;
  onModifica: (campo: Raccomandazione, valore: string) => void;
};

// Raccomandazioni idriche e nutrizionali del PianoAlimentare (UI_NT_1), entrambe facoltative.
export function RaccomandazioniPiano({ valori, errori, onModifica }: RaccomandazioniPianoProps) {
  return (
    <section aria-labelledby="titolo-raccomandazioni" className="grid gap-4 md:grid-cols-2">
      <h2 id="titolo-raccomandazioni" className="text-xl font-semibold md:col-span-2">
        Raccomandazioni
      </h2>
      {CAMPI.map(([campo, etichetta]) => {
        const idErrore = `${campo}-errore`;
        return (
          <label key={campo} className="flex flex-col gap-1 text-base">
            <span>
              {etichetta} <span className="text-sm text-muted-foreground">(facoltative)</span>
            </span>
            <textarea
              value={valori[campo]}
              maxLength={MAX_LUNGHEZZA_RACCOMANDAZIONI}
              aria-invalid={errori[campo] ? true : undefined}
              aria-describedby={errori[campo] ? idErrore : undefined}
              className={CLASSI_TESTO}
              onChange={(e) => onModifica(campo, e.target.value)}
            />
            {errori[campo] && (
              <span id={idErrore} className="text-sm text-destructive">
                {errori[campo]}
              </span>
            )}
          </label>
        );
      })}
    </section>
  );
}

"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { VoceAlimento } from "@/lib/bozzaPianoAlimentare";
import { MAX_ALIMENTI_PER_PASTO, MAX_LUNGHEZZA_VOCE } from "@/lib/validazionePianoAlimentare";

type PastoFieldsetProps = {
  /** Identificativo univoco del pasto, usato per gli id dei campi. */
  chiave: string;
  titolo: string;
  voci: readonly VoceAlimento[];
  errore?: string;
  onModificaVoce: (id: string, campo: "alimento" | "porzione", valore: string) => void;
  onAggiungiVoce: () => void;
  onRimuoviVoce: (id: string) => void;
};

const CLASSI_CAMPO =
  "h-11 w-full min-w-0 rounded-lg border bg-background px-3 text-base text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

// Un pasto del piano (Pasto del class diagram): righe di alimento e porzione in testo libero.
export function PastoFieldset({
  chiave,
  titolo,
  voci,
  errore,
  onModificaVoce,
  onAggiungiVoce,
  onRimuoviVoce,
}: PastoFieldsetProps) {
  const idErrore = `${chiave}-errore`;
  const invalido = errore ? true : undefined;
  // Indice della riga da mettere a fuoco dopo un'aggiunta o una rimozione: il pulsante
  // premuto scompare o resta lontano dal campo, e il focus non deve perdersi.
  const rigaDaFocalizzare = useRef<number | null>(null);

  useEffect(() => {
    const indice = rigaDaFocalizzare.current;
    if (indice === null) return;
    rigaDaFocalizzare.current = null;
    const voce = voci[Math.min(indice, voci.length - 1)];
    if (voce) document.getElementById(`${voce.id}-alimento`)?.focus();
  }, [voci]);

  return (
    <fieldset
      className="flex min-w-0 flex-col gap-3 rounded-xl border p-4 aria-invalid:border-destructive"
      aria-invalid={invalido}
      aria-describedby={errore ? idErrore : undefined}
    >
      <legend className="px-1 text-lg font-semibold">{titolo}</legend>

      <ul className="flex flex-col gap-3">
        {voci.map((voce, indice) => (
          <li key={voce.id} className="grid grid-cols-[1fr_auto] items-end gap-2 sm:grid-cols-[2fr_1fr_auto]">
            <label className="col-span-2 flex min-w-0 flex-col gap-1 text-sm text-muted-foreground sm:col-span-1">
              Alimento {indice + 1}
              <input
                id={`${voce.id}-alimento`}
                value={voce.alimento}
                maxLength={MAX_LUNGHEZZA_VOCE}
                autoComplete="off"
                aria-invalid={invalido}
                aria-describedby={errore ? idErrore : undefined}
                className={CLASSI_CAMPO}
                onChange={(e) => onModificaVoce(voce.id, "alimento", e.target.value)}
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-sm text-muted-foreground">
              Porzione
              <input
                value={voce.porzione}
                maxLength={MAX_LUNGHEZZA_VOCE}
                autoComplete="off"
                aria-invalid={invalido}
                aria-describedby={errore ? idErrore : undefined}
                className={CLASSI_CAMPO}
                onChange={(e) => onModificaVoce(voce.id, "porzione", e.target.value)}
              />
            </label>
            <Button
              type="button"
              variant="ghost"
              className="size-11"
              aria-label={`Rimuovi alimento ${indice + 1} da ${titolo.toLowerCase()}`}
              disabled={voci.length === 1}
              onClick={() => {
                rigaDaFocalizzare.current = Math.max(indice - 1, 0);
                onRimuoviVoce(voce.id);
              }}
            >
              <X aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>

      {errore && (
        <p id={idErrore} className="text-sm text-destructive">
          {errore}
        </p>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4 text-base"
          disabled={voci.length >= MAX_ALIMENTI_PER_PASTO}
          onClick={() => {
            rigaDaFocalizzare.current = voci.length;
            onAggiungiVoce();
          }}
        >
          <Plus aria-hidden="true" />
          Aggiungi alimento
        </Button>
      </div>
    </fieldset>
  );
}

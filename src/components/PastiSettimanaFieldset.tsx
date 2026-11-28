"use client";

import { useRef } from "react";
import { PastoFieldset } from "@/components/PastoFieldset";
import { idScheda, SchedeGiorni } from "@/components/SchedeGiorni";
import { contaVociCompilate, type BozzaPianoAlimentare, type VoceAlimento } from "@/lib/bozzaPianoAlimentare";
import {
  chiavePasto,
  ETICHETTE_GIORNO,
  ETICHETTE_PASTO,
  GIORNI_SETTIMANA,
  TIPI_PASTO,
  type GiornoSettimana,
} from "@/lib/pianoAlimentare";
import type { ErroriPianoAlimentare } from "@/lib/validazionePianoAlimentare";

const ID_PANNELLO = "pannello-giorno";

type PastiSettimanaFieldsetProps = {
  pasti: BozzaPianoAlimentare["pasti"];
  errori: ErroriPianoAlimentare;
  giorno: GiornoSettimana;
  onSelezionaGiorno: (giorno: GiornoSettimana) => void;
  onAggiornaVoci: (chiave: string, modifica: (voci: VoceAlimento[]) => VoceAlimento[]) => void;
};

// Griglia dei pasti del form del piano (UI_NT_1): schede dei giorni e, per il giorno scelto,
// i quattro pasti con le righe di alimento e porzione. Usata in creazione e in modifica.
export function PastiSettimanaFieldset({
  pasti,
  errori,
  giorno,
  onSelezionaGiorno,
  onAggiornaVoci,
}: PastiSettimanaFieldsetProps) {
  const contatore = useRef(0);
  const pastiPerGiorno = Object.fromEntries(
    GIORNI_SETTIMANA.map((g) => [g, TIPI_PASTO.filter((t) => contaVociCompilate(pasti[chiavePasto(g, t)]) > 0).length]),
  ) as Record<GiornoSettimana, number>;
  const giorniConErrori = new Set(GIORNI_SETTIMANA.filter((g) => TIPI_PASTO.some((t) => errori[chiavePasto(g, t)])));

  return (
    <section aria-labelledby="titolo-pasti" className="flex flex-col gap-4">
      <h2 id="titolo-pasti" className="text-xl font-semibold">
        Pasti della settimana
      </h2>
      <SchedeGiorni
        idPannello={ID_PANNELLO}
        giornoAttivo={giorno}
        pastiPerGiorno={pastiPerGiorno}
        giorniConErrori={giorniConErrori}
        onSeleziona={onSelezionaGiorno}
      />
      <div id={ID_PANNELLO} role="tabpanel" aria-labelledby={idScheda(giorno)} className="grid gap-4 lg:grid-cols-2">
        {TIPI_PASTO.map((tipo) => {
          const chiave = chiavePasto(giorno, tipo);
          return (
            <PastoFieldset
              key={chiave}
              chiave={chiave}
              titolo={`${ETICHETTE_PASTO[tipo]} di ${ETICHETTE_GIORNO[giorno].toLowerCase()}`}
              voci={pasti[chiave] ?? []}
              errore={errori[chiave]}
              onModificaVoce={(id, campo, valore) =>
                onAggiornaVoci(chiave, (voci) => voci.map((v) => (v.id === id ? { ...v, [campo]: valore } : v)))
              }
              onAggiungiVoce={() =>
                onAggiornaVoci(chiave, (voci) => [...voci, { id: `${chiave}-n${++contatore.current}`, alimento: "", porzione: "" }])
              }
              onRimuoviVoce={(id) => onAggiornaVoci(chiave, (voci) => voci.filter((v) => v.id !== id))}
            />
          );
        })}
      </div>
      {errori.pasti && (
        <p data-errore tabIndex={-1} className="text-base text-destructive outline-none">
          {errori.pasti}
        </p>
      )}
    </section>
  );
}

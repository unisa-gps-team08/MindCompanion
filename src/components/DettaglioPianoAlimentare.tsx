"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PastoLettura } from "@/components/PastoLettura";
import { idScheda, SchedeGiorni } from "@/components/SchedeGiorni";
import { Button } from "@/components/ui/button";
import { VistaSettimanalePiano } from "@/components/VistaSettimanalePiano";
import {
  chiavePasto,
  ETICHETTE_GIORNO,
  ETICHETTE_PASTO,
  GIORNI_SETTIMANA,
  TIPI_PASTO,
  type GiornoSettimana,
  type PastoInserito,
  type PianoAlimentareDettaglio,
} from "@/lib/pianoAlimentare";

type Vista = "giornaliera" | "settimanale";

const ID_PANNELLO = "pannello-giorno-piano";
const FORMATO_DATA = new Intl.DateTimeFormat("it-IT", { dateStyle: "long" });
// getDay() parte dalla domenica: questo ordine porta l'indice sui giorni del piano.
const GIORNO_DA_INDICE: readonly GiornoSettimana[] = [
  "DOMENICA", "LUNEDI", "MARTEDI", "MERCOLEDI", "GIOVEDI", "VENERDI", "SABATO",
];

/** Si apre su oggi se oggi ha pasti, altrimenti sul primo giorno con almeno un pasto. */
function giornoIniziale(pastiPerGiorno: Record<GiornoSettimana, number>): GiornoSettimana {
  const oggi = GIORNO_DA_INDICE[new Date().getDay()];
  if (pastiPerGiorno[oggi] > 0) return oggi;
  return GIORNI_SETTIMANA.find((giorno) => pastiPerGiorno[giorno] > 0) ?? "LUNEDI";
}

type DettaglioPianoAlimentareProps = {
  piano: PianoAlimentareDettaglio;
  /** Modifica ed Elimina sono solo del nutrizionista (RF_NT_4, RF_NT_5). */
  mostraAzioni: boolean;
};

// Contenuto di VisualizzaPianoAlimentarePage (RF_NT_7, SC_NT_4): vista giornaliera o
// settimanale dello stesso piano, raccomandazioni e azioni del nutrizionista.
export function DettaglioPianoAlimentare({ piano, mostraAzioni }: DettaglioPianoAlimentareProps) {
  const pastiPerChiave = useMemo(
    () => new Map<string, PastoInserito>(piano.pasti.map((p) => [chiavePasto(p.giorno, p.tipo), p])),
    [piano.pasti],
  );
  const pastiPerGiorno = useMemo(
    () =>
      Object.fromEntries(
        GIORNI_SETTIMANA.map((g) => [g, piano.pasti.filter((p) => p.giorno === g).length]),
      ) as Record<GiornoSettimana, number>,
    [piano.pasti],
  );
  const [vista, setVista] = useState<Vista>("giornaliera");
  const [giorno, setGiorno] = useState<GiornoSettimana>(() => giornoIniziale(pastiPerGiorno));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base text-muted-foreground">
          Creato il {FORMATO_DATA.format(new Date(piano.dataCreazione))}
          {piano.dataUltimaModifica &&
            ` · ultima modifica il ${FORMATO_DATA.format(new Date(piano.dataUltimaModifica))}`}
        </p>
        {mostraAzioni && (
          // Le azioni arrivano con ModificaPianoAlimentare (#29) ed EliminaPianoAlimentare (#30).
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 px-4 text-base" disabled>
              <Pencil aria-hidden="true" />
              Modifica
            </Button>
            <Button variant="destructive" className="h-11 px-4 text-base" disabled>
              <Trash2 aria-hidden="true" />
              Elimina
            </Button>
          </div>
        )}
      </div>

      <div role="group" aria-label="Vista del piano" className="flex w-fit gap-1 rounded-lg bg-muted p-1">
        {(["giornaliera", "settimanale"] as const).map((valore) => (
          <Button
            key={valore}
            type="button"
            variant={vista === valore ? "default" : "ghost"}
            aria-pressed={vista === valore}
            className="h-11 px-4 text-base"
            onClick={() => setVista(valore)}
          >
            {valore === "giornaliera" ? "Vista giornaliera" : "Vista settimanale"}
          </Button>
        ))}
      </div>

      {vista === "giornaliera" ? (
        <section aria-label="Vista giornaliera" className="flex flex-col gap-4">
          <SchedeGiorni
            idPannello={ID_PANNELLO}
            giornoAttivo={giorno}
            pastiPerGiorno={pastiPerGiorno}
            onSeleziona={setGiorno}
          />
          <div id={ID_PANNELLO} role="tabpanel" aria-labelledby={idScheda(giorno)} className="grid gap-4 md:grid-cols-2">
            {TIPI_PASTO.map((tipo) => (
              <PastoLettura
                key={tipo}
                titolo={`${ETICHETTE_PASTO[tipo]} di ${ETICHETTE_GIORNO[giorno].toLowerCase()}`}
                pasto={pastiPerChiave.get(chiavePasto(giorno, tipo))}
              />
            ))}
          </div>
        </section>
      ) : (
        <VistaSettimanalePiano pastiPerChiave={pastiPerChiave} />
      )}

      <section aria-labelledby="titolo-raccomandazioni-piano" className="grid gap-4 md:grid-cols-2">
        <h2 id="titolo-raccomandazioni-piano" className="text-xl font-semibold md:col-span-2">
          Raccomandazioni
        </h2>
        {(
          [
            ["Raccomandazioni idriche", piano.raccomandazioniIdriche],
            ["Raccomandazioni nutrizionali", piano.raccomandazioniNutrizionali],
          ] as const
        ).map(([titolo, testo]) => (
          <article key={titolo} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
            <h3 className="text-lg font-semibold">{titolo}</h3>
            <p className={testo ? "whitespace-pre-line" : "text-muted-foreground"}>
              {testo ?? "Nessuna raccomandazione."}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

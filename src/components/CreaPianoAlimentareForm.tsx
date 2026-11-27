"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { PastoFieldset } from "@/components/PastoFieldset";
import { RaccomandazioniPiano, type Raccomandazione } from "@/components/RaccomandazioniPiano";
import { idScheda, SchedeGiorni } from "@/components/SchedeGiorni";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  bozzaInPiano,
  contaVociCompilate,
  creaBozzaVuota,
  type BozzaPianoAlimentare,
  type VoceAlimento,
} from "@/lib/bozzaPianoAlimentare";
import {
  chiavePasto,
  ETICHETTE_GIORNO,
  ETICHETTE_PASTO,
  GIORNI_SETTIMANA,
  TIPI_PASTO,
  type GiornoSettimana,
} from "@/lib/pianoAlimentare";
import { validaPianoAlimentare, type ErroriPianoAlimentare } from "@/lib/validazionePianoAlimentare";

const ID_PANNELLO = "pannello-giorno";
const PERCORSO_RITORNO = "/nutrizionista";

// Invio in un campo di testo pubblicherebbe il piano a metà compilazione: si pubblica
// solo con il pulsante.
function bloccaInvioDaCampo(evento: KeyboardEvent<HTMLFormElement>) {
  if (evento.key === "Enter" && evento.target instanceof HTMLInputElement) evento.preventDefault();
}

/** Primo giorno con un errore su un pasto, per mostrarne subito la scheda. */
function primoGiornoConErrori(errori: ErroriPianoAlimentare): GiornoSettimana | undefined {
  return GIORNI_SETTIMANA.find((giorno) => Object.keys(errori).some((chiave) => chiave.startsWith(`pasti.${giorno}.`)));
}

// CreaPianoAlimentareForm (RF_NT_1, UI_NT_1): il nutrizionista compila i pasti della settimana,
// giorno per giorno, e le raccomandazioni, poi pubblica il piano del paziente.
export function CreaPianoAlimentareForm({ pazienteId }: { pazienteId: string }) {
  const [bozza, setBozza] = useState<BozzaPianoAlimentare>(creaBozzaVuota);
  const [giorno, setGiorno] = useState<GiornoSettimana>("LUNEDI");
  const [errori, setErrori] = useState<ErroriPianoAlimentare>({});
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [pubblicato, setPubblicato] = useState(false);
  const [inCorso, setInCorso] = useState(false);
  const [tentativiFalliti, setTentativiFalliti] = useState(0);
  const contatore = useRef(0);
  const modulo = useRef<HTMLFormElement>(null);

  // Dopo un invio non riuscito il focus va al primo campo da correggere (o al messaggio),
  // così chi usa tastiera o lettore di schermo arriva subito all'errore.
  useEffect(() => {
    if (tentativiFalliti === 0) return;
    modulo.current?.querySelector<HTMLElement>('input[aria-invalid="true"], textarea[aria-invalid="true"], [data-errore]')?.focus();
  }, [tentativiFalliti]);

  function aggiornaVoci(chiave: string, modifica: (voci: VoceAlimento[]) => VoceAlimento[]) {
    setBozza((precedente) => ({
      ...precedente,
      pasti: { ...precedente.pasti, [chiave]: modifica(precedente.pasti[chiave] ?? []) },
    }));
  }

  function aggiornaRaccomandazione(campo: Raccomandazione, valore: string) {
    setBozza((precedente) => ({ ...precedente, [campo]: valore }));
  }

  function mostraErrori(nuoviErrori: ErroriPianoAlimentare, testo: string) {
    setErrori(nuoviErrori);
    setMessaggio(testo);
    const giornoConErrori = primoGiornoConErrori(nuoviErrori);
    if (giornoConErrori) setGiorno(giornoConErrori);
    setTentativiFalliti((n) => n + 1);
  }

  async function pubblica(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const piano = bozzaInPiano(bozza);
    const esito = validaPianoAlimentare(piano);
    if (!esito.valido) {
      const numero = Object.keys(esito.errori).length;
      mostraErrori(esito.errori, `Il piano non è stato pubblicato: ${numero} ${numero === 1 ? "punto" : "punti"} da correggere.`);
      return;
    }

    setErrori({});
    setMessaggio(null);
    setInCorso(true);
    try {
      const risposta = await fetch(`/api/nutritionist/patients/${encodeURIComponent(pazienteId)}/meal-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(esito.valori),
      });
      if (risposta.ok) {
        setPubblicato(true);
        return;
      }
      const dati = (await risposta.json().catch(() => ({}))) as { errore?: string; campi?: ErroriPianoAlimentare };
      mostraErrori(dati.campi ?? {}, dati.errore ?? "Pubblicazione non riuscita.");
    } catch {
      mostraErrori(errori, "Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  if (pubblicato) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-xl border p-6 text-lg">
        <p className="font-semibold">Piano alimentare pubblicato.</p>
        <p>I pasti e le raccomandazioni sono salvati nel piano del paziente.</p>
        <Link href={PERCORSO_RITORNO} className={buttonVariants({ className: "h-11 px-4 text-base" })}>
          Torna ai pazienti
        </Link>
      </div>
    );
  }

  const pastiPerGiorno = Object.fromEntries(
    GIORNI_SETTIMANA.map((g) => [g, TIPI_PASTO.filter((t) => contaVociCompilate(bozza.pasti[chiavePasto(g, t)]) > 0).length]),
  ) as Record<GiornoSettimana, number>;
  const giorniConErrori = new Set(GIORNI_SETTIMANA.filter((g) => TIPI_PASTO.some((t) => errori[chiavePasto(g, t)])));

  return (
    <form
      ref={modulo}
      onSubmit={pubblica}
      onKeyDown={bloccaInvioDaCampo}
      noValidate
      className="flex min-w-0 flex-col gap-6"
    >
      <section aria-labelledby="titolo-pasti" className="flex flex-col gap-4">
        <h2 id="titolo-pasti" className="text-xl font-semibold">
          Pasti della settimana
        </h2>
        <SchedeGiorni
          idPannello={ID_PANNELLO}
          giornoAttivo={giorno}
          pastiPerGiorno={pastiPerGiorno}
          giorniConErrori={giorniConErrori}
          onSeleziona={setGiorno}
        />
        <div id={ID_PANNELLO} role="tabpanel" aria-labelledby={idScheda(giorno)} className="grid gap-4 lg:grid-cols-2">
          {TIPI_PASTO.map((tipo) => {
            const chiave = chiavePasto(giorno, tipo);
            return (
              <PastoFieldset
                key={chiave}
                chiave={chiave}
                titolo={`${ETICHETTE_PASTO[tipo]} di ${ETICHETTE_GIORNO[giorno].toLowerCase()}`}
                voci={bozza.pasti[chiave] ?? []}
                errore={errori[chiave]}
                onModificaVoce={(id, campo, valore) =>
                  aggiornaVoci(chiave, (voci) => voci.map((v) => (v.id === id ? { ...v, [campo]: valore } : v)))
                }
                onAggiungiVoce={() =>
                  aggiornaVoci(chiave, (voci) => [...voci, { id: `${chiave}-n${++contatore.current}`, alimento: "", porzione: "" }])
                }
                onRimuoviVoce={(id) => aggiornaVoci(chiave, (voci) => voci.filter((v) => v.id !== id))}
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

      <RaccomandazioniPiano
        valori={bozza}
        errori={errori}
        onModifica={aggiornaRaccomandazione}
      />

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link href={PERCORSO_RITORNO} className={buttonVariants({ variant: "outline", className: "h-11 px-4 text-base" })}>
          Annulla
        </Link>
        <Button type="submit" className="h-11 px-4 text-base" disabled={inCorso}>
          {inCorso ? "Pubblicazione in corso…" : "Pubblica piano alimentare"}
        </Button>
      </div>
      <p role="status" data-errore={messaggio ? true : undefined} tabIndex={-1} className="text-base text-destructive outline-none empty:hidden">
        {messaggio}
      </p>
    </form>
  );
}

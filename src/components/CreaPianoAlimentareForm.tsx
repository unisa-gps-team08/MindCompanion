"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Avviso } from "@/components/Avviso";
import { PastiSettimanaFieldset } from "@/components/PastiSettimanaFieldset";
import { RaccomandazioniPiano, type Raccomandazione } from "@/components/RaccomandazioniPiano";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  bozzaInPiano,
  creaBozzaVuota,
  pianoInBozza,
  type BozzaPianoAlimentare,
  type VoceAlimento,
} from "@/lib/bozzaPianoAlimentare";
import { GIORNI_SETTIMANA, type GiornoSettimana, type PianoAlimentareDettaglio } from "@/lib/pianoAlimentare";
import { validaPianoAlimentare, type ErroriPianoAlimentare } from "@/lib/validazionePianoAlimentare";

const PERCORSO_RITORNO = "/nutrizionista";

/** Parametro che la vista del piano legge per mostrare il toast di salvataggio (RF_NT_4). */
export const PARAMETRO_ESITO_MODIFICA = "esito=modificato";

// Invio in un campo di testo pubblicherebbe il piano a metà compilazione: si pubblica
// solo con il pulsante.
function bloccaInvioDaCampo(evento: KeyboardEvent<HTMLFormElement>) {
  if (evento.key === "Enter" && evento.target instanceof HTMLInputElement) evento.preventDefault();
}

/** Primo giorno con un errore su un pasto, per mostrarne subito la scheda. */
function primoGiornoConErrori(errori: ErroriPianoAlimentare): GiornoSettimana | undefined {
  return GIORNI_SETTIMANA.find((giorno) => Object.keys(errori).some((chiave) => chiave.startsWith(`pasti.${giorno}.`)));
}

type CreaPianoAlimentareFormProps = {
  pazienteId: string;
  /** Piano da modificare (RF_NT_4): se presente il form parte precompilato e salva con PUT. */
  pianoIniziale?: PianoAlimentareDettaglio;
};

// CreaPianoAlimentareForm (RF_NT_1, UI_NT_1): il nutrizionista compila i pasti della settimana,
// giorno per giorno, e le raccomandazioni, poi pubblica il piano del paziente. Con un piano
// iniziale è il form di ModificaPianoAlimentare (RF_NT_4).
export function CreaPianoAlimentareForm({ pazienteId, pianoIniziale }: CreaPianoAlimentareFormProps) {
  const router = useRouter();
  const modifica = pianoIniziale !== undefined;
  const percorsoPiano = `/nutrizionista/pazienti/${encodeURIComponent(pazienteId)}/piano-alimentare`;
  const [bozza, setBozza] = useState<BozzaPianoAlimentare>(() =>
    pianoIniziale ? pianoInBozza(pianoIniziale) : creaBozzaVuota(),
  );
  const [giorno, setGiorno] = useState<GiornoSettimana>("LUNEDI");
  const [errori, setErrori] = useState<ErroriPianoAlimentare>({});
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [pubblicato, setPubblicato] = useState(false);
  const [inCorso, setInCorso] = useState(false);
  const [tentativiFalliti, setTentativiFalliti] = useState(0);
  const modulo = useRef<HTMLFormElement>(null);

  // Dopo un invio non riuscito il focus va al primo campo da correggere (o al messaggio),
  // così chi usa tastiera o lettore di schermo arriva subito all'errore.
  useEffect(() => {
    if (tentativiFalliti === 0) return;
    modulo.current?.querySelector<HTMLElement>('input[aria-invalid="true"], textarea[aria-invalid="true"], [data-errore]')?.focus();
  }, [tentativiFalliti]);

  function aggiornaVoci(chiave: string, cambia: (voci: VoceAlimento[]) => VoceAlimento[]) {
    setBozza((precedente) => ({
      ...precedente,
      pasti: { ...precedente.pasti, [chiave]: cambia(precedente.pasti[chiave] ?? []) },
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

  async function invia(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const esito = validaPianoAlimentare(bozzaInPiano(bozza));
    if (!esito.valido) {
      const numero = Object.keys(esito.errori).length;
      const azione = modifica ? "salvato" : "pubblicato";
      mostraErrori(esito.errori, `Il piano non è stato ${azione}: ${numero} ${numero === 1 ? "punto" : "punti"} da correggere.`);
      return;
    }

    setErrori({});
    setMessaggio(null);
    setInCorso(true);
    try {
      const risposta = await fetch(`/api/nutritionist/patients/${encodeURIComponent(pazienteId)}/meal-plan`, {
        method: modifica ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(esito.valori),
      });
      if (risposta.ok) {
        // In modifica si torna al piano, che mostra il toast e le modifiche salvate.
        if (modifica) router.push(`${percorsoPiano}?${PARAMETRO_ESITO_MODIFICA}`);
        else setPubblicato(true);
        return;
      }
      const dati = (await risposta.json().catch(() => ({}))) as { errore?: string; campi?: ErroriPianoAlimentare };
      mostraErrori(dati.campi ?? {}, dati.errore ?? (modifica ? "Salvataggio non riuscito." : "Pubblicazione non riuscita."));
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

  const etichettaInvio = modifica
    ? inCorso ? "Salvataggio in corso…" : "Salva modifiche"
    : inCorso ? "Pubblicazione in corso…" : "Pubblica piano alimentare";

  return (
    <form ref={modulo} onSubmit={invia} onKeyDown={bloccaInvioDaCampo} noValidate className="flex min-w-0 flex-col gap-6">
      {/* UC_NT_1, flusso 4.a1: il questionario alimentare non è in questo sprint. */}
      {!modifica && (
        <Avviso tipo="informazione">
          Le risposte al questionario alimentare non sono ancora disponibili. Puoi comunque compilare
          e pubblicare il piano alimentare del paziente.
        </Avviso>
      )}
      <PastiSettimanaFieldset
        pasti={bozza.pasti}
        errori={errori}
        giorno={giorno}
        onSelezionaGiorno={setGiorno}
        onAggiornaVoci={aggiornaVoci}
      />

      <RaccomandazioniPiano valori={bozza} errori={errori} onModifica={aggiornaRaccomandazione} />

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href={modifica ? percorsoPiano : PERCORSO_RITORNO}
          className={buttonVariants({ variant: "outline", className: "h-11 px-4 text-base" })}
        >
          Annulla
        </Link>
        <Button type="submit" className="h-11 px-4 text-base" disabled={inCorso}>
          {etichettaInvio}
        </Button>
      </div>
      <p role="status" data-errore={messaggio ? true : undefined} tabIndex={-1} className="text-base text-destructive outline-none empty:hidden">
        {messaggio}
      </p>
    </form>
  );
}

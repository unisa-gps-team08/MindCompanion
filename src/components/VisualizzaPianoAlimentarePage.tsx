"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Avviso } from "@/components/Avviso";
import { DettaglioPianoAlimentare } from "@/components/DettaglioPianoAlimentare";
import { ToastEsito, type DatiToast } from "@/components/ToastEsito";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PianoAlimentareDettaglio } from "@/lib/pianoAlimentare";

type Esito =
  | { tipo: "piano"; piano: PianoAlimentareDettaglio }
  | { tipo: "assente" }
  | { tipo: "negato"; messaggio: string }
  | { tipo: "errore"; messaggio: string };

type Risposta = { piano?: PianoAlimentareDettaglio; pianoAssente?: boolean; errore?: string };

type VisualizzaPianoAlimentarePageProps = {
  pazienteId: string;
  /** Base dell'API del ruolo, es. "/api/nutritionist/patients". */
  endpointApiBase: string;
  /** Scheda del paziente da cui si arriva, es. "/nutrizionista/pazienti/<id>". */
  percorsoScheda: string;
  /** Solo il nutrizionista crea, modifica ed elimina il piano. */
  gestionePiano: boolean;
};

async function leggiEsito(risposta: Response): Promise<Esito> {
  const dati = (await risposta.json().catch(() => ({}))) as Risposta;
  if (risposta.ok && dati.piano) return { tipo: "piano", piano: dati.piano };
  if (risposta.status === 404 && dati.pianoAssente) return { tipo: "assente" };
  if (risposta.status === 403) {
    return { tipo: "negato", messaggio: dati.errore ?? "Accesso negato a questo paziente." };
  }
  return { tipo: "errore", messaggio: dati.errore ?? "Impossibile caricare il piano alimentare." };
}

// VisualizzaPianoAlimentarePage (RF_NT_7, SC_NT_4): legge il piano dall'API del ruolo e lo
// mostra; pensata per essere riusata da paziente e tutore con un altro endpoint.
export function VisualizzaPianoAlimentarePage({
  pazienteId,
  endpointApiBase,
  percorsoScheda,
  gestionePiano,
}: VisualizzaPianoAlimentarePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const parametri = useSearchParams();
  // Dopo ModificaPianoAlimentare (RF_NT_4) il form torna qui con ?esito=modificato: si mostra
  // il toast una volta e si toglie il parametro, così un ricaricamento non lo ripete.
  const [toast, setToast] = useState<DatiToast | null>(() =>
    parametri.get("esito") === "modificato"
      ? { id: Date.now(), tipo: "successo", messaggio: "Piano alimentare aggiornato." }
      : null,
  );
  const chiudiToast = useCallback(() => setToast(null), []);
  useEffect(() => {
    if (parametri.get("esito") === "modificato") router.replace(pathname, { scroll: false });
  }, [parametri, pathname, router]);
  const [tentativo, setTentativo] = useState(0);
  const [stato, setStato] = useState<{ chiave: string; esito: Esito } | null>(null);
  const chiave = `${endpointApiBase}|${pazienteId}|${tentativo}`;
  const esito = stato?.chiave === chiave ? stato.esito : null;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${endpointApiBase}/${encodeURIComponent(pazienteId)}/meal-plan`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (risposta) => {
        if (risposta.status === 401) {
          router.replace("/login");
          return;
        }
        setStato({ chiave, esito: await leggiEsito(risposta) });
      })
      .catch((errore: unknown) => {
        if (errore instanceof DOMException && errore.name === "AbortError") return;
        setStato({
          chiave,
          esito: { tipo: "errore", messaggio: "Servizio non raggiungibile, controlla la connessione e riprova." },
        });
      });
    return () => controller.abort();
  }, [chiave, endpointApiBase, pazienteId, router]);

  if (!esito) {
    return (
      <div aria-busy="true" aria-label="Caricamento del piano alimentare" className="flex flex-col gap-4">
        <Skeleton className="h-11 w-64" />
        <Skeleton className="h-11 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (esito.tipo === "piano") {
    return (
      <>
        <DettaglioPianoAlimentare
          piano={esito.piano}
          mostraAzioni={gestionePiano}
          percorsoModifica={`${percorsoScheda}/piano-alimentare/modifica`}
        />
        <ToastEsito toast={toast} onChiudi={chiudiToast} />
      </>
    );
  }

  if (esito.tipo === "assente") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border bg-card p-6">
        <p className="text-lg">Il paziente non ha ancora un piano alimentare.</p>
        {gestionePiano && (
          <Link href={`${percorsoScheda}/piano-alimentare/nuovo`} className={buttonVariants({ className: "h-11 px-4 text-base" })}>
            Crea piano alimentare
          </Link>
        )}
      </div>
    );
  }

  return (
    <Avviso
      tipo="errore"
      azione={
        esito.tipo === "errore" ? (
          <Button variant="outline" className="h-11 px-4 text-base" onClick={() => setTentativo((n) => n + 1)}>
            Riprova
          </Button>
        ) : undefined
      }
    >
      {esito.messaggio}
    </Avviso>
  );
}

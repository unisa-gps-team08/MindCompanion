"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avviso } from "@/components/Avviso";
import { CreaPianoAlimentareForm } from "@/components/CreaPianoAlimentareForm";
import { Skeleton } from "@/components/ui/skeleton";
import type { PianoAlimentareDettaglio } from "@/lib/pianoAlimentare";

type Stato = { tipo: "caricamento" } | { tipo: "piano"; piano: PianoAlimentareDettaglio } | { tipo: "errore"; messaggio: string };

// ModificaPianoAlimentarePage (RF_NT_4, SC_NT_3): carica il piano attuale e apre il form della
// creazione precompilato. Il salvataggio passa per PUT e torna alla vista del piano.
export function ModificaPianoAlimentarePage({ pazienteId }: { pazienteId: string }) {
  const router = useRouter();
  const [stato, setStato] = useState<Stato>({ tipo: "caricamento" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/nutritionist/patients/${encodeURIComponent(pazienteId)}/meal-plan`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (risposta) => {
        if (risposta.status === 401) {
          router.replace("/login");
          return;
        }
        const dati = (await risposta.json().catch(() => ({}))) as { piano?: PianoAlimentareDettaglio; errore?: string };
        setStato(
          risposta.ok && dati.piano
            ? { tipo: "piano", piano: dati.piano }
            : { tipo: "errore", messaggio: dati.errore ?? "Impossibile caricare il piano alimentare." },
        );
      })
      .catch((errore: unknown) => {
        if (errore instanceof DOMException && errore.name === "AbortError") return;
        setStato({ tipo: "errore", messaggio: "Servizio non raggiungibile, controlla la connessione e riprova." });
      });
    return () => controller.abort();
  }, [pazienteId, router]);

  if (stato.tipo === "caricamento") {
    return (
      <div aria-busy="true" aria-label="Caricamento del piano alimentare" className="flex flex-col gap-4">
        <Skeleton className="h-11 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }
  if (stato.tipo === "errore") return <Avviso tipo="errore">{stato.messaggio}</Avviso>;
  return <CreaPianoAlimentareForm pazienteId={pazienteId} pianoIniziale={stato.piano} />;
}

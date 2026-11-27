"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleX, ShieldAlert } from "lucide-react";
import {
  DettaglioAnagraficoPaziente,
  type AzioneSchedaPaziente,
} from "@/components/DettaglioAnagraficoPaziente";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PazienteAssociato } from "@/lib/validazioneRicercaPazienti";

type SchedaPazientePageProps = {
  pazienteId: string;
  endpointApiBase: string;
  percorsoElenco: string;
  percorsoBaseScheda: string;
  etichettaElenco?: string;
  azioni: readonly AzioneSchedaPaziente[];
};

type StatoScheda = {
  chiaveCaricata: string;
  paziente: PazienteAssociato | null;
  accessoNegato: boolean;
  errore: string | null;
};

type RispostaSchedaPaziente = {
  paziente?: PazienteAssociato;
  errore?: string;
};

function SchedaPazienteSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Vista riutilizzabile della scheda anagrafica del paziente (RF_NT_6, condivisibile
 * con Medico e Tutore). Gestisce esplicitamente il caso 403 senza esporre dati.
 */
export function SchedaPazientePage({
  pazienteId,
  endpointApiBase,
  percorsoElenco,
  percorsoBaseScheda,
  etichettaElenco = "I miei pazienti",
  azioni,
}: SchedaPazientePageProps) {
  const router = useRouter();
  const [tentativo, setTentativo] = useState(0);
  const [stato, setStato] = useState<StatoScheda>({
    chiaveCaricata: "",
    paziente: null,
    accessoNegato: false,
    errore: null,
  });

  const chiaveRichiesta = `${endpointApiBase}|${pazienteId}|${tentativo}`;
  const inCaricamento = stato.chiaveCaricata !== chiaveRichiesta;

  useEffect(() => {
    const controller = new AbortController();

    async function caricaPaziente() {
      try {
        const risposta = await fetch(
          `${endpointApiBase}/${encodeURIComponent(pazienteId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (risposta.status === 401) {
          router.replace("/login");
          return;
        }

        const dati = (await risposta.json().catch(() => ({}))) as RispostaSchedaPaziente;

        if (risposta.status === 403) {
          setStato({
            chiaveCaricata: chiaveRichiesta,
            paziente: null,
            accessoNegato: true,
            errore:
              dati.errore ??
              "Accesso negato: questo paziente non è associato al tuo profilo.",
          });
          return;
        }

        if (
          !risposta.ok ||
          !dati.paziente ||
          typeof dati.paziente !== "object" ||
          !Array.isArray(dati.paziente.tutori)
        ) {
          setStato({
            chiaveCaricata: chiaveRichiesta,
            paziente: null,
            accessoNegato: false,
            errore: dati.errore ?? "Impossibile caricare la scheda del paziente.",
          });
          return;
        }

        setStato({
          chiaveCaricata: chiaveRichiesta,
          paziente: dati.paziente,
          accessoNegato: false,
          errore: null,
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStato({
          chiaveCaricata: chiaveRichiesta,
          paziente: null,
          accessoNegato: false,
          errore: "Servizio non raggiungibile, controlla la connessione e riprova.",
        });
      }
    }

    void caricaPaziente();
    return () => controller.abort();
  }, [chiaveRichiesta, endpointApiBase, pazienteId, router]);

  function riprova() {
    setTentativo((precedente) => precedente + 1);
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
      <div>
        <Link
          href={percorsoElenco}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span>Torna a {etichettaElenco}</span>
        </Link>
      </div>

      {inCaricamento ? (
        <SchedaPazienteSkeleton />
      ) : stato.accessoNegato ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-4 rounded-xl border border-destructive/30 bg-card p-6 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <ShieldAlert aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-destructive">Accesso negato</h1>
              <p className="text-sm text-foreground">
                {stato.errore ??
                  "Non sei autorizzato a visualizzare la scheda di questo paziente."}
              </p>
            </div>
          </div>
          <Link
            href={percorsoElenco}
            className={buttonVariants({ variant: "default", size: "default" })}
          >
            Torna a {etichettaElenco}
          </Link>
        </div>
      ) : stato.errore || !stato.paziente ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          <div className="flex items-center gap-2.5">
            <CircleX aria-hidden="true" className="size-4 shrink-0" />
            <span>{stato.errore ?? "Scheda paziente non disponibile."}</span>
          </div>
          <Button variant="outline" size="sm" onClick={riprova}>
            Riprova
          </Button>
        </div>
      ) : (
        <DettaglioAnagraficoPaziente
          paziente={stato.paziente}
          percorsoBaseScheda={percorsoBaseScheda}
          azioni={azioni}
        />
      )}
    </section>
  );
}

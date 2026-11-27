"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleX, Search, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ListaPazienti } from "@/components/ListaPazienti";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LUNGHEZZA_MASSIMA_RICERCA_PAZIENTI, type PazienteAssociato } from "@/lib/validazioneRicercaPazienti";

const RITARDO_RICERCA_MS = 250;

type ElencoPazientiPageProps = {
  titolo?: string;
  sottotitolo?: string;
  endpointApi: string;
  percorsoBaseScheda: string;
  messaggioVuoto?: string;
};

type StatoRicerca = { chiaveCaricata: string; pazienti: PazienteAssociato[]; errore: string | null };
type RispostaElencoPazienti = { pazienti?: PazienteAssociato[]; errore?: string };

function ElencoPazientiSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

function ContenutoElencoPazienti({
  titolo = "I miei pazienti",
  sottotitolo = "Elenco dei pazienti associati al tuo profilo e dei relativi tutori.",
  endpointApi,
  percorsoBaseScheda,
  messaggioVuoto = "Al momento non hai pazienti associati.",
}: ElencoPazientiPageProps) {
  const router = useRouter();
  const [searchUrl, setSearchUrl] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true, history: "replace" }),
  );
  const [bozzaRicerca, setBozzaRicerca] = useState<string | null>(null);
  const [tentativo, setTentativo] = useState(0);
  const [stato, setStato] = useState<StatoRicerca>({ chiaveCaricata: "", pazienti: [], errore: null });
  const timerDebounceRef = useRef<number | null>(null);

  const searchNormalizzata = searchUrl.trim();
  const chiaveRichiesta = `${endpointApi}|${searchNormalizzata}|${tentativo}`;
  const inCaricamento = stato.chiaveCaricata !== chiaveRichiesta;
  const valoreInput = bozzaRicerca ?? searchUrl;

  useEffect(() => {
    return () => {
      if (timerDebounceRef.current !== null) window.clearTimeout(timerDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function caricaPazienti() {
      const parametri = new URLSearchParams();
      if (searchNormalizzata) parametri.set("search", searchNormalizzata);
      const queryString = parametri.toString();
      const url = queryString ? `${endpointApi}?${queryString}` : endpointApi;

      try {
        const risposta = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (risposta.status === 401) {
          router.replace("/login");
          return;
        }

        const dati = (await risposta.json().catch(() => ({}))) as RispostaElencoPazienti;
        const erroreRisposta =
          !risposta.ok || !Array.isArray(dati.pazienti)
            ? (dati.errore ?? "Impossibile caricare l'elenco dei pazienti.")
            : null;
        setStato({
          chiaveCaricata: chiaveRichiesta,
          pazienti: erroreRisposta ? [] : (dati.pazienti ?? []),
          errore: erroreRisposta,
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStato({
          chiaveCaricata: chiaveRichiesta,
          pazienti: [],
          errore: "Servizio non raggiungibile, controlla la connessione e riprova.",
        });
      }
    }

    void caricaPazienti();
    return () => controller.abort();
  }, [chiaveRichiesta, endpointApi, router, searchNormalizzata]);

  function aggiornaRicerca(prossimoValore: string) {
    setBozzaRicerca(prossimoValore);
    if (timerDebounceRef.current !== null) window.clearTimeout(timerDebounceRef.current);
    timerDebounceRef.current = window.setTimeout(() => {
      void setSearchUrl(prossimoValore.trim()).then(() => {
        setBozzaRicerca((corrente) => (corrente === prossimoValore ? null : corrente));
      });
    }, RITARDO_RICERCA_MS);
  }

  function azzeraRicerca() {
    if (timerDebounceRef.current !== null) {
      window.clearTimeout(timerDebounceRef.current);
      timerDebounceRef.current = null;
    }
    setBozzaRicerca(null);
    void setSearchUrl("");
  }

  const haRicercaAttiva = valoreInput.trim().length > 0 || searchNormalizzata.length > 0;
  const numeroPazienti = stato.pazienti.length;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{titolo}</h1>
          <p className="text-sm text-muted-foreground">{sottotitolo}</p>
        </div>
        {!inCaricamento && !stato.errore && (
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {numeroPazienti === 1 ? "1 paziente" : `${numeroPazienti} pazienti`}
          </span>
        )}
      </div>

      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <label className="block">
          <span className="sr-only">Cerca paziente per nome, cognome, codice fiscale o e-mail</span>
          <input
            type="search"
            value={valoreInput}
            maxLength={LUNGHEZZA_MASSIMA_RICERCA_PAZIENTI}
            onChange={(e) => aggiornaRicerca(e.target.value)}
            placeholder="Cerca per nome, cognome, codice fiscale o e-mail"
            className="h-10 w-full rounded-lg border border-input bg-card pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        {valoreInput.length > 0 && (
          <button
            type="button"
            onClick={azzeraRicerca}
            aria-label="Cancella testo di ricerca"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      {!inCaricamento && stato.errore && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <div className="flex items-center gap-2.5">
            <CircleX aria-hidden="true" className="size-4 shrink-0" />
            <span>{stato.errore}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setTentativo((precedente) => precedente + 1)}>
            Riprova
          </Button>
        </div>
      )}

      <ListaPazienti
        pazienti={stato.pazienti}
        percorsoBaseScheda={percorsoBaseScheda}
        inCaricamento={inCaricamento}
        haRicercaAttiva={haRicercaAttiva}
        messaggioVuoto={messaggioVuoto}
        onAzzeraRicerca={azzeraRicerca}
      />
    </section>
  );
}

/**
 * Vista riutilizzabile per l'elenco dei pazienti associati (RF_NT_6, condivisibile
 * con Medico e Tutore) con ricerca sincronizzata su `?search=` tramite `nuqs`.
 */
export function ElencoPazientiPage(props: ElencoPazientiPageProps) {
  return (
    <NuqsAdapter>
      <Suspense fallback={<ElencoPazientiSkeleton />}>
        <ContenutoElencoPazienti {...props} />
      </Suspense>
    </NuqsAdapter>
  );
}

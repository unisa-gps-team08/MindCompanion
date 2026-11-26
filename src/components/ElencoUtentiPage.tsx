"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EliminaUtenteDialog } from "@/components/EliminaUtenteDialog";
import { LogoutButton } from "@/components/LogoutButton";
import { ETICHETTE_RUOLO, TabellaUtenti } from "@/components/TabellaUtenti";
import { ToastEsito, type DatiToast } from "@/components/ToastEsito";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LUNGHEZZA_MASSIMA_RICERCA,
  RUOLI_UTENTE,
  type UtenteAnagrafico,
} from "@/lib/validazioneRicercaUtenti";

const RITARDO_RICERCA_MS = 250;

type RispostaElencoUtenti = {
  utenti?: UtenteAnagrafico[];
  errore?: string;
};

// ElencoUtentiPage (RF_AD_7): vista principale dell'area amministratore con ricerca testuale,
// filtro per ruolo e azioni per riga (Modifica Utente, Elimina, Gestisci associazioni).
export function ElencoUtentiPage() {
  const router = useRouter();
  const [utenti, setUtenti] = useState<UtenteAnagrafico[]>([]);
  const [search, setSearch] = useState("");
  const [searchApplicata, setSearchApplicata] = useState("");
  const [role, setRole] = useState("");
  const [inCaricamento, setInCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  const [tentativo, setTentativo] = useState(0);
  const [utenteDaEliminare, setUtenteDaEliminare] = useState<UtenteAnagrafico | null>(null);
  const [toast, setToast] = useState<DatiToast | null>(null);

  // Debounce della ricerca testuale per evitare una chiamata API a ogni singolo carattere.
  useEffect(() => {
    const timer = window.setTimeout(() => setSearchApplicata(search), RITARDO_RICERCA_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function caricaUtenti() {
      setInCaricamento(true);
      setErrore(null);

      const parametri = new URLSearchParams({
        search: searchApplicata.trim(),
        role,
      });

      try {
        const risposta = await fetch(`/api/admin/users?${parametri.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (risposta.status === 401) {
          router.replace("/login");
          return;
        }

        const dati = (await risposta.json().catch(() => ({}))) as RispostaElencoUtenti;
        if (!risposta.ok || !Array.isArray(dati.utenti)) {
          setErrore(dati.errore ?? "Impossibile caricare l'elenco degli utenti.");
          setInCaricamento(false);
          return;
        }

        setUtenti(dati.utenti);
        setInCaricamento(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
        setInCaricamento(false);
      }
    }

    void caricaUtenti();
    return () => controller.abort();
  }, [router, searchApplicata, role, tentativo]);

  function azzeraFiltri() {
    setSearch("");
    setSearchApplicata("");
    setRole("");
  }

  function riprova() {
    setTentativo((precedente) => precedente + 1);
  }

  const chiudiToast = useCallback(() => setToast(null), []);

  function gestisciEliminato(eliminato: UtenteAnagrafico) {
    setUtenteDaEliminare(null);
    setUtenti((precedenti) => precedenti.filter((u) => u.id !== eliminato.id));
    setTentativo((precedente) => precedente + 1);
    setToast({
      id: Date.now(),
      tipo: "successo",
      messaggio: `Utente ${eliminato.nome} ${eliminato.cognome} eliminato con successo.`,
    });
  }

  function gestisciErroreEliminazione(messaggio: string) {
    setToast({ id: Date.now(), tipo: "errore", messaggio });
  }

  const haFiltriAttivi = search.trim().length > 0 || role.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="text-sm font-bold tracking-wider uppercase text-foreground">
            Area Personale
          </span>
          <nav aria-label="Navigazione amministratore" className="flex flex-wrap items-center gap-2">
            <Link
              href="/amministratore"
              aria-current="page"
              className={buttonVariants({ variant: "default", size: "default" })}
            >
              Elenco utenti
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Elenco utenti
          </h1>
          <Link
            href="/amministratore/utenti/nuovo"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Aggiungi Nuovo Utente
          </Link>
        </div>

        <section aria-label="Ricerca e filtro utenti" className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Cerca per nome, cognome, codice fiscale o e-mail</span>
            <input
              type="search"
              value={search}
              maxLength={LUNGHEZZA_MASSIMA_RICERCA}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per nome, cognome, codice fiscale o e-mail"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          <label className="sm:w-52">
            <span className="sr-only">Filtra per ruolo</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Filtra per ruolo"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Tutti i ruoli</option>
              {RUOLI_UTENTE.map((valoreRuolo) => (
                <option key={valoreRuolo} value={valoreRuolo}>
                  {ETICHETTE_RUOLO[valoreRuolo]}
                </option>
              ))}
            </select>
          </label>
        </section>

        {errore && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <span>{errore}</span>
            <Button variant="outline" size="sm" onClick={riprova}>
              Riprova
            </Button>
          </div>
        )}

        <TabellaUtenti
          utenti={utenti}
          inCaricamento={inCaricamento}
          haFiltriAttivi={haFiltriAttivi}
          onAzzeraFiltri={azzeraFiltri}
          onRichiediEliminazione={setUtenteDaEliminare}
        />

        <EliminaUtenteDialog
          key={utenteDaEliminare?.id ?? "chiuso"}
          utente={utenteDaEliminare}
          onChiudi={() => setUtenteDaEliminare(null)}
          onEliminato={gestisciEliminato}
          onErrore={gestisciErroreEliminazione}
          onSessioneScaduta={() => router.replace("/login")}
        />
        <ToastEsito toast={toast} onChiudi={chiudiToast} />
      </main>
    </div>
  );
}

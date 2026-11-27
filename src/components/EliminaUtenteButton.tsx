"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { ETICHETTE_RUOLO } from "@/components/TabellaUtenti";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UtenteAnagrafico } from "@/lib/validazioneRicercaUtenti";

type RispostaEliminazione = {
  id?: string;
  errore?: string;
};

type EliminaUtenteDialogProps = {
  utente: UtenteAnagrafico | null;
  onChiudi: () => void;
  onEliminato: (utente: UtenteAnagrafico) => void;
  onNonTrovato: (utente: UtenteAnagrafico, messaggio: string) => void;
  onSessioneScaduta: () => void;
};

/** Finestra di conferma AlertDialog per EliminaUtente (RF_AD_3). */
export function EliminaUtenteDialog({
  utente,
  onChiudi,
  onEliminato,
  onNonTrovato,
  onSessioneScaduta,
}: EliminaUtenteDialogProps) {
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  function gestisciCambioApertura(aperto: boolean) {
    // Non chiude la finestra mentre la richiesta DELETE è ancora in corso.
    if (!aperto && !inCorso) {
      setErrore(null);
      onChiudi();
    }
  }

  async function confermaEliminazione() {
    if (!utente || inCorso) return;

    setInCorso(true);
    setErrore(null);

    try {
      const risposta = await fetch(`/api/admin/users/${utente.id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (risposta.status === 401) {
        onSessioneScaduta();
        return;
      }

      const dati = (await risposta.json().catch(() => ({}))) as RispostaEliminazione;
      if (risposta.status === 404) {
        setErrore(null);
        onNonTrovato(utente, dati.errore ?? "Utente non trovato.");
        return;
      }

      if (!risposta.ok) {
        setErrore(dati.errore ?? "Impossibile eliminare l'utente, riprova.");
        return;
      }

      setErrore(null);
      onEliminato(utente);
    } catch {
      setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <AlertDialog open={utente !== null} onOpenChange={gestisciCambioApertura}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle aria-hidden className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg text-primary">
            Conferma eliminazione utente
          </AlertDialogTitle>
          <AlertDialogDescription>
            Stai per eliminare definitivamente questo utente dalla piattaforma MindCompanion. Tutti
            i suoi dati e associazioni andranno persi. Sei sicuro di voler continuare?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {utente && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
            <dt className="font-medium text-muted-foreground">Utente</dt>
            <dd className="font-medium text-foreground">
              {utente.cognome} {utente.nome}
            </dd>
            <dt className="font-medium text-muted-foreground">Ruolo</dt>
            <dd className="text-foreground">{ETICHETTE_RUOLO[utente.ruolo]}</dd>
            <dt className="font-medium text-muted-foreground">E-mail</dt>
            <dd className="break-all text-foreground">{utente.email}</dd>
            <dt className="font-medium text-muted-foreground">Codice fiscale</dt>
            <dd className="font-mono text-xs tracking-wide text-foreground">
              {utente.codiceFiscale}
            </dd>
          </dl>
        )}

        {errore && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errore}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={inCorso}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant="destructive"
            onClick={confermaEliminazione}
            disabled={inCorso}
            className="bg-destructive text-primary-foreground hover:bg-destructive/90"
          >
            {inCorso ? "Eliminazione in corso…" : "Elimina utente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

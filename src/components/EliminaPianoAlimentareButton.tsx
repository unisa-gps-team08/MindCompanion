"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

/** Parametro che la scheda paziente legge per mostrare il toast dopo l'eliminazione (RF_NT_5). */
export const ESITO_PIANO_ELIMINATO = "piano-eliminato";

type EliminaPianoAlimentareButtonProps = {
  pazienteId: string;
  /** Scheda del paziente a cui tornare, dove compare "Crea piano alimentare". */
  percorsoScheda: string;
};

// EliminaPianoAlimentare (RF_NT_5): pulsante "Elimina" con conferma AlertDialog. Dopo
// l'eliminazione si torna alla scheda del paziente, che offre di creare un nuovo piano.
export function EliminaPianoAlimentareButton({ pazienteId, percorsoScheda }: EliminaPianoAlimentareButtonProps) {
  const router = useRouter();
  const [aperto, setAperto] = useState(false);
  const [inCorso, setInCorso] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  function cambiaApertura(nuovo: boolean) {
    // Mentre la richiesta DELETE è in corso la finestra resta aperta.
    if (inCorso) return;
    setErrore(null);
    setAperto(nuovo);
  }

  async function conferma() {
    setInCorso(true);
    setErrore(null);
    try {
      const risposta = await fetch(`/api/nutritionist/patients/${encodeURIComponent(pazienteId)}/meal-plan`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (risposta.status === 401) {
        router.replace("/login");
        return;
      }
      const dati = (await risposta.json().catch(() => ({}))) as { errore?: string; pianoAssente?: boolean };
      // Anche "piano già assente" porta allo stato voluto: il paziente è senza piano.
      if (risposta.ok || dati.pianoAssente) {
        router.push(`${percorsoScheda}?esito=${ESITO_PIANO_ELIMINATO}`);
        return;
      }
      setErrore(dati.errore ?? "Impossibile eliminare il piano alimentare, riprova.");
    } catch {
      setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <AlertDialog open={aperto} onOpenChange={cambiaApertura}>
      <Button variant="destructive" className="h-11 px-4 text-base" onClick={() => setAperto(true)}>
        <Trash2 aria-hidden="true" />
        Elimina
      </Button>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle aria-hidden className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg text-primary">Eliminare il piano alimentare?</AlertDialogTitle>
          <AlertDialogDescription>
            Il piano del paziente, con tutti i pasti e le raccomandazioni, viene eliminato
            definitivamente. Potrai crearne uno nuovo dalla scheda del paziente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {errore && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errore}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={inCorso}>Annulla</AlertDialogCancel>
          <AlertDialogAction type="button" variant="destructive" onClick={conferma} disabled={inCorso}>
            {inCorso ? "Eliminazione in corso…" : "Elimina piano"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AssociazioniPazienteAttuali, RuoloFigura } from "@/lib/associazioniPaziente";

type RimuoviAssociazioneButtonProps = {
  pazienteId: string;
  nomePaziente: string;
  ruoloFigura: RuoloFigura;
  nomeFigura: string;
  /** Obbligatorio per i tutori: indica quale tutore togliere. */
  tutoreId?: string;
  /** Chiamata a rimozione avvenuta: il messaggio lo mostra chi usa il pulsante, perché il pulsante sparisce. */
  onRimossa: (associazioni: AssociazioniPazienteAttuali | null, messaggio: string) => void;
};

// RimuoviAssociazioneButton (RF_AD_11): chiede conferma, poi toglie il legame.
// La conferma è un <dialog> nativo aperto con showModal(): il browser gestisce focus trap,
// chiusura con Esc e ripristino del focus sul pulsante "Rimuovi", senza nuove dipendenze.
export function RimuoviAssociazioneButton({
  pazienteId,
  nomePaziente,
  ruoloFigura,
  nomeFigura,
  tutoreId,
  onRimossa,
}: RimuoviAssociazioneButtonProps) {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const [dialogoAperto, setDialogoAperto] = useState(false);
  const [inRimozione, setInRimozione] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const etichettaRuolo = ruoloFigura.toLowerCase();
  const idBase = `${pazienteId}-${ruoloFigura}-${tutoreId ?? ""}`;

  // Allinea il <dialog> nativo allo stato React; il focus iniziale va su "Annulla" (azione sicura).
  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (dialogoAperto && !dialogo.open) {
      dialogo.showModal();
      dialogo.querySelector<HTMLButtonElement>("[data-focus-iniziale]")?.focus();
    } else if (!dialogoAperto && dialogo.open) {
      dialogo.close();
    }
  }, [dialogoAperto]);

  function apri() {
    setErrore(null);
    setDialogoAperto(true);
  }

  async function confermaRimozione() {
    setInRimozione(true);
    setErrore(null);
    try {
      const parametri = new URLSearchParams({ ruoloFigura });
      if (tutoreId) parametri.set("tutoreId", tutoreId);

      const risposta = await fetch(`/api/admin/associations/${pazienteId}?${parametri.toString()}`, {
        method: "DELETE",
      });
      const dati = (await risposta.json().catch(() => ({}))) as {
        errore?: string;
        messaggio?: string;
        associazioni?: AssociazioniPazienteAttuali | null;
      };

      if (!risposta.ok) {
        setErrore(dati.errore ?? "Impossibile rimuovere l'associazione.");
        return;
      }
      // Si chiude il modale prima di aggiornare l'elenco: il pulsante sparisce e il dialogo non deve restare aperto.
      dialogoRef.current?.close();
      setDialogoAperto(false);
      onRimossa(dati.associazioni ?? null, dati.messaggio ?? "Associazione rimossa.");
    } catch {
      setErrore("Servizio non raggiungibile: l'associazione non è stata rimossa.");
    } finally {
      setInRimozione(false);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={apri}>
        Rimuovi
      </Button>

      <dialog
        ref={dialogoRef}
        role="alertdialog"
        aria-labelledby={`titolo-rimozione-${idBase}`}
        aria-describedby={`descrizione-rimozione-${idBase}`}
        // Durante la richiesta Esc non chiude il dialogo.
        onCancel={(evento) => {
          if (inRimozione) evento.preventDefault();
        }}
        // Esc (a richiesta ferma) chiude il dialogo nativo: si riallinea lo stato.
        onClose={() => setDialogoAperto(false)}
        className="m-auto w-full max-w-md rounded-lg border bg-white p-6 shadow-lg backdrop:bg-black/40"
      >
        <h3 id={`titolo-rimozione-${idBase}`} className="text-lg font-semibold text-gray-900">
          Conferma rimozione associazione
        </h3>
        <p id={`descrizione-rimozione-${idBase}`} className="mt-2 text-sm text-gray-700">
          Vuoi rimuovere l&apos;associazione tra <strong>{nomePaziente}</strong> e {etichettaRuolo}{" "}
          <strong>{nomeFigura}</strong>?
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Gli account utente non verranno eliminati.{" "}
          {ruoloFigura === "NUTRIZIONISTA"
            ? "L'eventuale piano alimentare del paziente resterà disponibile."
            : "Il legame potrà essere assegnato di nuovo in seguito."}
        </p>

        {errore && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {errore}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            data-focus-iniziale
            disabled={inRimozione}
            onClick={() => setDialogoAperto(false)}
          >
            Annulla
          </Button>
          <Button type="button" disabled={inRimozione} onClick={confermaRimozione}>
            {inRimozione ? "Rimozione..." : "Conferma rimozione"}
          </Button>
        </div>
      </dialog>
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
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

// RimuoviAssociazioneButton (RF_AD_11, nel RAD precedente RF_AD_13): chiede conferma, poi toglie il legame.
export function RimuoviAssociazioneButton({
  pazienteId,
  nomePaziente,
  ruoloFigura,
  nomeFigura,
  tutoreId,
  onRimossa,
}: RimuoviAssociazioneButtonProps) {
  const [dialogoAperto, setDialogoAperto] = useState(false);
  const [inRimozione, setInRimozione] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const etichettaRuolo = ruoloFigura.toLowerCase();
  const idBase = `${pazienteId}-${ruoloFigura}-${tutoreId ?? ""}`;

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

      {dialogoAperto && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`titolo-rimozione-${idBase}`}
          aria-describedby={`descrizione-rimozione-${idBase}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
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
              <Button type="button" variant="outline" disabled={inRimozione} onClick={() => setDialogoAperto(false)}>
                Annulla
              </Button>
              <Button type="button" disabled={inRimozione} onClick={confermaRimozione}>
                {inRimozione ? "Rimozione..." : "Conferma rimozione"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

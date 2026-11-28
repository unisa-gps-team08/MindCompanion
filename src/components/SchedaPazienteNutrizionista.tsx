"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AzioneSchedaPaziente } from "@/components/DettaglioAnagraficoPaziente";
import { ESITO_PIANO_ELIMINATO } from "@/components/EliminaPianoAlimentareButton";
import { SchedaPazientePage } from "@/components/SchedaPazientePage";
import { ToastEsito, type DatiToast } from "@/components/ToastEsito";

const AZIONE_APRI_PIANO: AzioneSchedaPaziente = {
  titolo: "Piano alimentare",
  descrizione: "Consulta o gestisci il piano alimentare settimanale e le raccomandazioni del paziente.",
  etichettaPulsante: "Apri piano alimentare",
  percorsoRelativo: "piano-alimentare",
  icona: "alimentazione",
};

const AZIONE_CREA_PIANO: AzioneSchedaPaziente = {
  titolo: "Piano alimentare",
  descrizione: "Il paziente non ha ancora un piano alimentare.",
  etichettaPulsante: "Crea piano alimentare",
  percorsoRelativo: "piano-alimentare/nuovo",
  icona: "alimentazione",
};

// Scheda paziente del nutrizionista (RF_NT_6) con l'azione sul piano alimentare: "Crea piano
// alimentare" solo se il paziente non ha un piano (RF_NT_1), altrimenti "Apri piano alimentare".
// Dopo EliminaPianoAlimentare (RF_NT_5) mostra il toast di conferma.
export function SchedaPazienteNutrizionista({ pazienteId }: { pazienteId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const parametri = useSearchParams();
  const [pianoAssente, setPianoAssente] = useState(false);
  const [toast, setToast] = useState<DatiToast | null>(() =>
    parametri.get("esito") === ESITO_PIANO_ELIMINATO
      ? { id: Date.now(), tipo: "successo", messaggio: "Piano alimentare eliminato." }
      : null,
  );
  const chiudiToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (parametri.get("esito") === ESITO_PIANO_ELIMINATO) router.replace(pathname, { scroll: false });
  }, [parametri, pathname, router]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/nutritionist/patients/${encodeURIComponent(pazienteId)}/meal-plan`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (risposta) => {
        const dati = (await risposta.json().catch(() => ({}))) as { pianoAssente?: boolean };
        setPianoAssente(risposta.status === 404 && dati.pianoAssente === true);
      })
      // Se la verifica non riesce resta "Apri piano alimentare": la pagina del piano gestisce l'errore.
      .catch(() => undefined);
    return () => controller.abort();
  }, [pazienteId]);

  return (
    <>
      <SchedaPazientePage
        pazienteId={pazienteId}
        endpointApiBase="/api/nutritionist/patients"
        percorsoElenco="/nutrizionista"
        percorsoBaseScheda="/nutrizionista/pazienti"
        etichettaElenco="I miei pazienti"
        azioni={[pianoAssente ? AZIONE_CREA_PIANO : AZIONE_APRI_PIANO]}
      />
      <ToastEsito toast={toast} onChiudi={chiudiToast} />
    </>
  );
}

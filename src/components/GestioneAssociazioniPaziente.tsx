"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModificaAssociazioneForm } from "@/components/ModificaAssociazioneForm";
import type { AssociazioniPazienteAttuali, FiguraDisponibile } from "@/lib/associazioniPaziente";

type Dati = { associazioni: AssociazioniPazienteAttuali; utentiDisponibili: FiguraDisponibile[] };

// Carica dall'API le associazioni del paziente e le figure disponibili, poi mostra il form (RF_AD_10).
export function GestioneAssociazioniPaziente({ pazienteId }: { pazienteId: string }) {
  const router = useRouter();
  const [dati, setDati] = useState<Dati | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    let annullato = false;

    async function carica() {
      try {
        const risposta = await fetch(`/api/admin/associations/${pazienteId}`);
        const corpo = (await risposta.json().catch(() => ({}))) as Partial<Dati> & { errore?: string };
        if (annullato) return;

        if (!risposta.ok || !corpo.associazioni || !corpo.utentiDisponibili) {
          setErrore(corpo.errore ?? "Impossibile caricare le associazioni del paziente.");
          return;
        }
        setDati({ associazioni: corpo.associazioni, utentiDisponibili: corpo.utentiDisponibili });
      } catch {
        if (!annullato) setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
      }
    }

    void carica();
    return () => {
      annullato = true;
    };
  }, [pazienteId]);

  if (errore) {
    return (
      <p role="alert" className="text-lg text-red-700">
        {errore}
      </p>
    );
  }
  if (!dati) return <p className="text-lg">Caricamento…</p>;

  return (
    <ModificaAssociazioneForm
      associazioniAttuali={dati.associazioni}
      utentiDisponibili={dati.utentiDisponibili}
      onSuccess={(associazioni) => setDati({ ...dati, associazioni })}
      onCancel={() => router.push("/amministratore/associazioni")}
    />
  );
}

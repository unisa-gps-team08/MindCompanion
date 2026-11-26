"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { PazienteElenco } from "@/lib/associazioniPaziente";

// Elenco dei pazienti con la ricerca e il pulsante "Gestisci associazioni" (RF_AD_10, RF_AD_11).
export function ElencoPazientiAssociazioni() {
  const [pazienti, setPazienti] = useState<PazienteElenco[] | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [ricerca, setRicerca] = useState("");

  useEffect(() => {
    let annullato = false;

    async function carica() {
      try {
        const risposta = await fetch("/api/admin/associations");
        const dati = (await risposta.json().catch(() => ({}))) as { pazienti?: PazienteElenco[]; errore?: string };
        if (annullato) return;

        if (!risposta.ok || !dati.pazienti) {
          setErrore(dati.errore ?? "Impossibile caricare l'elenco dei pazienti.");
          return;
        }
        setPazienti(dati.pazienti);
      } catch {
        if (!annullato) setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
      }
    }

    void carica();
    return () => {
      annullato = true;
    };
  }, []);

  const filtrati = useMemo(() => {
    const query = ricerca.trim().toLowerCase();
    if (!pazienti || !query) return pazienti ?? [];
    return pazienti.filter((p) => `${p.nome} ${p.cognome} ${p.codiceFiscale} ${p.email}`.toLowerCase().includes(query));
  }, [pazienti, ricerca]);

  if (errore) {
    return (
      <p role="alert" className="text-lg text-red-700">
        {errore}
      </p>
    );
  }
  if (!pazienti) return <p className="text-lg">Caricamento…</p>;

  return (
    <div className="flex flex-col gap-4 text-lg">
      <label className="flex flex-col gap-1">
        Cerca per nome, cognome, codice fiscale o e-mail
        <input
          type="search"
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          className="rounded-lg border px-3 py-2"
        />
      </label>

      {filtrati.length === 0 ? (
        <p>Nessun paziente trovato.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {filtrati.map((paziente) => (
            <li key={paziente.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span>
                <strong>
                  {paziente.cognome} {paziente.nome}
                </strong>{" "}
                <span className="text-base text-gray-600">({paziente.codiceFiscale})</span>
              </span>
              <Link
                href={`/amministratore/pazienti/${paziente.id}/associazioni`}
                className={buttonVariants({ variant: "outline" })}
              >
                Gestisci associazioni
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

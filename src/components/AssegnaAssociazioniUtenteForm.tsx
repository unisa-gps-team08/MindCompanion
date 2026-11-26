"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const RUOLI = ["MEDICO", "NUTRIZIONISTA", "TUTORE"] as const;
type Ruolo = (typeof RUOLI)[number];

type UtenteAnagrafico = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  codiceFiscale: string;
  dataNascita: string;
};

type Paziente = UtenteAnagrafico & {
  associazioni: {
    medico: string | null;
    medicoNome: string | null;
    nutrizionista: string | null;
    nutrizionistaNome: string | null;
    tutori: string[];
    tutoriNomi: string[];
  };
};

type DatiElenco = { pazienti: Paziente[]; utenti: UtenteAnagrafico[] };
type RispostaApi = { errore?: string; messaggio?: string };

const ETICHETTE: Record<Ruolo, string> = {
  MEDICO: "Medico",
  NUTRIZIONISTA: "Nutrizionista",
  TUTORE: "Tutore",
};

function nomeCompleto(utente: UtenteAnagrafico) {
  return `${utente.nome} ${utente.cognome}`;
}

export function AssegnaAssociazioniUtenteForm() {
  const [ruolo, setRuolo] = useState<Ruolo>("MEDICO");
  const [pazienteId, setPazienteId] = useState("");
  const [utenteId, setUtenteId] = useState("");
  const [dati, setDati] = useState<DatiElenco>({ pazienti: [], utenti: [] });
  const [caricamento, setCaricamento] = useState(true);
  const [invio, setInvio] = useState(false);
  const [esito, setEsito] = useState<{ errore: boolean; testo: string } | null>(null);

  const caricaDati = useCallback(async (ruoloSelezionato: Ruolo) => {
    setCaricamento(true);
    try {
      const risposta = await fetch(`/api/admin/associazioni?ruolo=${ruoloSelezionato}`, {
        cache: "no-store",
      });
      const risultato = (await risposta.json()) as DatiElenco & RispostaApi;
      if (!risposta.ok) throw new Error(risultato.errore ?? "Impossibile caricare gli utenti.");
      setDati(risultato);
      setPazienteId((precedente) =>
        risultato.pazienti.some((paziente) => paziente.id === precedente)
          ? precedente
          : risultato.pazienti[0]?.id ?? "",
      );
      setUtenteId("");
    } catch (errore) {
      setEsito({
        errore: true,
        testo: errore instanceof Error ? errore.message : "Errore durante il caricamento.",
      });
    } finally {
      setCaricamento(false);
    }
  }, []);

  useEffect(() => {
    void caricaDati(ruolo);
  }, [ruolo, caricaDati]);

  const pazienteSelezionato = dati.pazienti.find((paziente) => paziente.id === pazienteId);
  const idAssociati = pazienteSelezionato
    ? ruolo === "MEDICO"
      ? pazienteSelezionato.associazioni.medico
      : ruolo === "NUTRIZIONISTA"
        ? pazienteSelezionato.associazioni.nutrizionista
        : null
    : null;

  async function associa() {
    setEsito(null);
    setInvio(true);
    try {
      const risposta = await fetch("/api/admin/associazioni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pazienteId, utenteId, ruolo }),
      });
      const risultato = (await risposta.json()) as RispostaApi;
      if (!risposta.ok) throw new Error(risultato.errore ?? "Associazione non riuscita.");
      setEsito({ errore: false, testo: risultato.messaggio ?? "Associazione creata." });
      await caricaDati(ruolo);
    } catch (errore) {
      setEsito({
        errore: true,
        testo: errore instanceof Error ? errore.message : "Errore durante l'associazione.",
      });
    } finally {
      setInvio(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          Paziente
          <select
            value={pazienteId}
            onChange={(evento) => {
              setPazienteId(evento.target.value);
              setUtenteId("");
              setEsito(null);
            }}
            disabled={caricamento || dati.pazienti.length === 0}
            className="rounded-lg border px-3 py-2"
          >
            {dati.pazienti.length === 0 && <option value="">Nessun paziente registrato</option>}
            {dati.pazienti.map((paziente) => (
              <option key={paziente.id} value={paziente.id}>
                {nomeCompleto(paziente)} — {paziente.codiceFiscale}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          Figura da associare
          <select
            value={ruolo}
            onChange={(evento) => {
              setRuolo(evento.target.value as Ruolo);
              setEsito(null);
            }}
            className="rounded-lg border px-3 py-2"
          >
            {RUOLI.map((voce) => <option key={voce} value={voce}>{ETICHETTE[voce]}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          Utente da associare
          <select
            value={utenteId}
            onChange={(evento) => setUtenteId(evento.target.value)}
            disabled={caricamento || dati.utenti.length === 0}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">Seleziona un utente…</option>
            {dati.utenti.map((utente) => (
              <option key={utente.id} value={utente.id}>
                {nomeCompleto(utente)} — {utente.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      {pazienteSelezionato && (
        <section className="border p-4">
          <h2 className="font-semibold">Associazioni attuali di {nomeCompleto(pazienteSelezionato)}</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Medico: {pazienteSelezionato.associazioni.medicoNome ?? "Nessuno"}</li>
            <li>Nutrizionista: {pazienteSelezionato.associazioni.nutrizionistaNome ?? "Nessuno"}</li>
            <li>Tutori: {pazienteSelezionato.associazioni.tutoriNomi.length > 0
              ? pazienteSelezionato.associazioni.tutoriNomi.join(", ")
              : "Nessuno"}</li>
          </ul>
          {idAssociati && (
            <p className="mt-2 text-sm" role="status">
              È già presente un {ETICHETTE[ruolo].toLowerCase()}. La nuova associazione sarà rifiutata:
              per sostituirlo occorre la funzione di modifica delle associazioni.
            </p>
          )}
        </section>
      )}

      {dati.utenti.length === 0 && !caricamento && (
        <p role="status">Nessun utente registrato con ruolo {ETICHETTE[ruolo].toLowerCase()}.</p>
      )}
      {esito && (
        <p role={esito.errore ? "alert" : "status"} className={esito.errore ? "text-red-700" : "text-green-700"}>
          {esito.testo}
        </p>
      )}
      <div>
        <Button
          type="button"
          size="lg"
          disabled={caricamento || invio || !pazienteId || !utenteId || dati.utenti.length === 0}
          onClick={associa}
        >
          {invio ? "Associazione in corso…" : "Associa"}
        </Button>
      </div>
    </div>
  );
}

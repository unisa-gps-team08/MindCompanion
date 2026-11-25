"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { CredenzialiDialog, type Credenziali } from "@/components/CredenzialiDialog";
import { Button } from "@/components/ui/button";
import { RUOLI_REGISTRABILI, type ErroriCampi } from "@/lib/validazioneNuovoUtente";

const ETICHETTE_RUOLO: Record<(typeof RUOLI_REGISTRABILI)[number], string> = {
  PAZIENTE: "Paziente",
  MEDICO: "Medico",
  NUTRIZIONISTA: "Nutrizionista",
  TUTORE: "Tutore",
};

const VALORI_INIZIALI = {
  nome: "",
  cognome: "",
  email: "",
  codiceFiscale: "",
  dataNascita: "",
  ruolo: "",
  codiceMedico: "",
  specializzazione: "",
};

type NomeCampo = keyof typeof VALORI_INIZIALI;
type Esito = { tipo: "errore"; messaggio: string } | null;

type CampoProps = InputHTMLAttributes<HTMLInputElement> & {
  etichetta: string;
  nome: NomeCampo;
  errore?: string;
};

function Campo({ etichetta, nome, errore, ...input }: CampoProps) {
  return (
    <label className="flex flex-col gap-1">
      {etichetta}
      <input
        name={nome}
        aria-invalid={errore ? true : undefined}
        className="rounded-lg border px-3 py-2 aria-invalid:border-red-700"
        {...input}
      />
      {errore && <span className="text-sm text-red-700">{errore}</span>}
    </label>
  );
}

// InserisciUtenteForm (RF_AD_1): registrazione di un nuovo utente da parte dell'amministratore.
// Non ha campi password: la password temporanea la genera il sistema.
export function InserisciUtenteForm() {
  const [valori, setValori] = useState(VALORI_INIZIALI);
  const [errori, setErrori] = useState<ErroriCampi>({});
  const [esito, setEsito] = useState<Esito>(null);
  const [credenziali, setCredenziali] = useState<Credenziali | null>(null);
  const [inCorso, setInCorso] = useState(false);

  function aggiorna(nome: NomeCampo, valore: string) {
    setValori((precedenti) => ({ ...precedenti, [nome]: valore }));
  }

  function propsCampo(nome: NomeCampo) {
    return {
      nome,
      value: valori[nome],
      errore: errori[nome],
      onChange: (e: { target: { value: string } }) => aggiorna(nome, e.target.value),
    };
  }

  async function conferma(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEsito(null);
    setErrori({});
    setInCorso(true);

    try {
      const risposta = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valori),
      });
      const dati = (await risposta.json().catch(() => ({}))) as {
        errore?: string;
        campi?: ErroriCampi;
        email?: string;
        passwordTemporanea?: string;
      };

      if (!risposta.ok || !dati.email || !dati.passwordTemporanea) {
        setErrori(dati.campi ?? {});
        setEsito({ tipo: "errore", messaggio: dati.errore ?? "Registrazione non riuscita." });
        return;
      }
      setValori(VALORI_INIZIALI);
      setCredenziali({ email: dati.email, passwordTemporanea: dati.passwordTemporanea });
    } catch {
      setEsito({ tipo: "errore", messaggio: "Servizio non raggiungibile, controlla la connessione e riprova." });
    } finally {
      setInCorso(false);
    }
  }

  // Chiudendo la finestra la password esce dallo stato e non è più recuperabile.
  if (credenziali) return <CredenzialiDialog credenziali={credenziali} onChiudi={() => setCredenziali(null)} />;

  return (
    <form onSubmit={conferma} className="flex flex-col gap-4 text-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Nome" required autoComplete="off" {...propsCampo("nome")} />
        <Campo etichetta="Cognome" required autoComplete="off" {...propsCampo("cognome")} />
        <Campo etichetta="E-mail" type="email" required autoComplete="off" {...propsCampo("email")} />
        <Campo
          etichetta="Codice fiscale"
          required
          maxLength={16}
          pattern="[A-Za-z0-9]{16}"
          title="16 caratteri tra lettere e numeri"
          autoComplete="off"
          {...propsCampo("codiceFiscale")}
        />
        <Campo etichetta="Data di nascita" type="date" required {...propsCampo("dataNascita")} />

        <label className="flex flex-col gap-1">
          Ruolo
          <select
            name="ruolo"
            required
            value={valori.ruolo}
            onChange={(e) => aggiorna("ruolo", e.target.value)}
            aria-invalid={errori.ruolo ? true : undefined}
            className="rounded-lg border px-3 py-2 aria-invalid:border-red-700"
          >
            <option value="" disabled>
              Seleziona…
            </option>
            {RUOLI_REGISTRABILI.map((ruolo) => (
              <option key={ruolo} value={ruolo}>
                {ETICHETTE_RUOLO[ruolo]}
              </option>
            ))}
          </select>
          {errori.ruolo && <span className="text-sm text-red-700">{errori.ruolo}</span>}
        </label>

        {valori.ruolo === "MEDICO" && (
          <>
            <Campo etichetta="Codice medico" required autoComplete="off" {...propsCampo("codiceMedico")} />
            <Campo etichetta="Specializzazione" required autoComplete="off" {...propsCampo("specializzazione")} />
          </>
        )}
      </div>

      {esito && (
        <p role="alert" className="text-red-700">
          {esito.messaggio}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={inCorso}>
          {inCorso ? "Registrazione in corso…" : "Conferma"}
        </Button>
      </div>
    </form>
  );
}

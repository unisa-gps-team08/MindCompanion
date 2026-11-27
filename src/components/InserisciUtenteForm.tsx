"use client";

import { useState, type FormEvent } from "react";
import { Campo } from "@/components/CampoForm";
import { CredenzialiDialog, type Credenziali } from "@/components/CredenzialiDialog";
import { Avviso } from "@/components/Avviso";
import { Button } from "@/components/ui/button";
import { RUOLI_REGISTRABILI, type ErroriCampi } from "@/lib/validazioneNuovoUtente";

export const ETICHETTE_RUOLO: Record<(typeof RUOLI_REGISTRABILI)[number], string> = {
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
    <form onSubmit={conferma} className="flex flex-col gap-6">
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
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

        {/* Stesso aspetto di Campo (CampoForm), per un select nativo accessibile da tastiera. */}
        <label className="flex flex-col gap-1.5">
          <span className="text-base font-medium">Ruolo</span>
          <select
            name="ruolo"
            required
            value={valori.ruolo}
            onChange={(e) => aggiorna("ruolo", e.target.value)}
            aria-invalid={errori.ruolo ? true : undefined}
            className="h-12 rounded-lg border border-input bg-background px-3 text-lg shadow-xs transition-[border-color,box-shadow] outline-none hover:border-foreground/30 focus-visible:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-destructive/15"
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
          {errori.ruolo && <span className="text-sm font-medium text-destructive">{errori.ruolo}</span>}
        </label>

        {valori.ruolo === "MEDICO" && (
          <>
            <Campo etichetta="Codice medico" required autoComplete="off" {...propsCampo("codiceMedico")} />
            <Campo etichetta="Specializzazione" required autoComplete="off" {...propsCampo("specializzazione")} />
          </>
        )}
      </div>

      {esito && <Avviso tipo="errore">{esito.messaggio}</Avviso>}

      <div>
        <Button type="submit" size="lg" disabled={inCorso}>
          {inCorso ? "Registrazione in corso…" : "Conferma"}
        </Button>
      </div>
    </form>
  );
}

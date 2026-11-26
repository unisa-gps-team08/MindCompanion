"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CampoPassword } from "@/components/CampoPassword";
import { Button } from "@/components/ui/button";
import {
  LUNGHEZZA_MINIMA_PASSWORD,
  type CambioPassword,
  type ErroriCambioPassword,
} from "@/lib/validazioneCambioPassword";

const VALORI_INIZIALI: CambioPassword = { passwordAttuale: "", nuovaPassword: "", confermaPassword: "" };

const CAMPI: { nome: keyof CambioPassword; etichetta: string; autoComplete: string; minLength?: number }[] = [
  { nome: "passwordAttuale", etichetta: "Password attuale", autoComplete: "current-password" },
  {
    nome: "nuovaPassword",
    etichetta: `Nuova password (almeno ${LUNGHEZZA_MINIMA_PASSWORD} caratteri)`,
    autoComplete: "new-password",
    minLength: LUNGHEZZA_MINIMA_PASSWORD,
  },
  {
    nome: "confermaPassword",
    etichetta: "Conferma nuova password",
    autoComplete: "new-password",
    minLength: LUNGHEZZA_MINIMA_PASSWORD,
  },
];

// CambiaPasswordForm (RF_UE_3, RF_UE_4): password attuale, nuova password e conferma.
export function CambiaPasswordForm() {
  const router = useRouter();
  const [valori, setValori] = useState(VALORI_INIZIALI);
  const [errori, setErrori] = useState<ErroriCambioPassword>({});
  const [errore, setErrore] = useState("");
  const [inCorso, setInCorso] = useState(false);
  // Cambia a ogni svuotamento: i campi si ricreano e tornano anche nascosti.
  const [versione, setVersione] = useState(0);

  // Con Cache Components la pagina resta montata tra una navigazione e l'altra:
  // senza svuotare il form, le password resterebbero scritte al ritorno.
  function svuota() {
    setValori(VALORI_INIZIALI);
    setErrori({});
    setErrore("");
    setVersione((precedente) => precedente + 1);
  }

  function annulla() {
    svuota();
    // Aperta da un link diretto non c'è una pagina precedente: "/" porta il proxy all'area dell'utente.
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  async function conferma(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrore("");
    setErrori({});
    setInCorso(true);

    try {
      const risposta = await fetch("/api/auth/cambia-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valori),
      });
      const dati = (await risposta.json().catch(() => ({}))) as {
        errore?: string;
        campi?: ErroriCambioPassword;
        area?: string;
      };

      if (!risposta.ok || !dati.area) {
        setErrori(dati.campi ?? {});
        setErrore(dati.errore ?? "Cambio password non riuscito.");
        return;
      }
      svuota();
      router.push(dati.area);
    } catch {
      setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <form onSubmit={conferma} className="flex flex-col gap-4 text-lg">
      {CAMPI.map(({ nome, etichetta, autoComplete, minLength }) => (
        <CampoPassword
          key={`${nome}-${versione}`}
          nome={nome}
          etichetta={etichetta}
          autoComplete={autoComplete}
          minLength={minLength}
          valore={valori[nome]}
          errore={errori[nome]}
          onCambia={(valore) => setValori((precedenti) => ({ ...precedenti, [nome]: valore }))}
        />
      ))}

      {errore && (
        <p role="alert" className="text-red-700">
          {errore}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={inCorso}>
          {inCorso ? "Salvataggio in corso…" : "Salva nuova password"}
        </Button>
        {/* Al primo accesso il proxy riporta comunque qui (RF_UE_4). */}
        <Button type="button" size="lg" variant="outline" disabled={inCorso} onClick={annulla}>
          Annulla
        </Button>
      </div>
    </form>
  );
}

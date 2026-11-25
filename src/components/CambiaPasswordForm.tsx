"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LUNGHEZZA_MINIMA_PASSWORD,
  type CambioPassword,
  type ErroriCambioPassword,
} from "@/lib/validazioneCambioPassword";

const VALORI_INIZIALI: CambioPassword = { passwordAttuale: "", nuovaPassword: "", confermaPassword: "" };

const CAMPI: { nome: keyof CambioPassword; etichetta: string; autoComplete: string }[] = [
  { nome: "passwordAttuale", etichetta: "Password attuale", autoComplete: "current-password" },
  {
    nome: "nuovaPassword",
    etichetta: `Nuova password (almeno ${LUNGHEZZA_MINIMA_PASSWORD} caratteri)`,
    autoComplete: "new-password",
  },
  { nome: "confermaPassword", etichetta: "Conferma nuova password", autoComplete: "new-password" },
];

// CambiaPasswordForm (RF_UE_3, RF_UE_4): password attuale, nuova password e conferma.
export function CambiaPasswordForm() {
  const router = useRouter();
  const [valori, setValori] = useState(VALORI_INIZIALI);
  const [errori, setErrori] = useState<ErroriCambioPassword>({});
  const [errore, setErrore] = useState("");
  const [inCorso, setInCorso] = useState(false);

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
      router.push(dati.area);
    } catch {
      setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <form onSubmit={conferma} className="flex flex-col gap-4 text-lg">
      {CAMPI.map(({ nome, etichetta, autoComplete }) => (
        <label key={nome} className="flex flex-col gap-1">
          {etichetta}
          <input
            type="password"
            name={nome}
            required
            autoComplete={autoComplete}
            minLength={nome === "passwordAttuale" ? undefined : LUNGHEZZA_MINIMA_PASSWORD}
            value={valori[nome]}
            onChange={(e) => setValori((precedenti) => ({ ...precedenti, [nome]: e.target.value }))}
            aria-invalid={errori[nome] ? true : undefined}
            className="rounded-lg border px-3 py-2 aria-invalid:border-red-700"
          />
          {errori[nome] && <span className="text-sm text-red-700">{errori[nome]}</span>}
        </label>
      ))}

      {errore && (
        <p role="alert" className="text-red-700">
          {errore}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={inCorso}>
          {inCorso ? "Salvataggio in corso…" : "Salva nuova password"}
        </Button>
      </div>
    </form>
  );
}

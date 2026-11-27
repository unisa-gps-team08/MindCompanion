"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Avviso } from "@/components/Avviso";
import { Campo } from "@/components/CampoForm";
import { SchedaAccesso } from "@/components/SchedaAccesso";
import { Button } from "@/components/ui/button";

// LoginPage (RF_UE_1).
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [inCorso, setInCorso] = useState(false);

  async function accedi(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrore("");
    setInCorso(true);

    // try/finally: anche se la rete cade il pulsante torna attivo e compare un messaggio.
    try {
      const risposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!risposta.ok) {
        const dati = (await risposta.json().catch(() => ({}))) as { errore?: string };
        setErrore(dati.errore ?? "Accesso non riuscito.");
        return;
      }
      // Dopo il login si entra nell'area del proprio ruolo.
      const { area } = (await risposta.json()) as { area: string };
      router.push(area);
    } catch {
      setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <SchedaAccesso titolo="Accedi" descrizione="Inserisci l'e-mail e la password del tuo account.">
      <form onSubmit={accedi} className="flex flex-col gap-5">
        <Campo
          etichetta="E-mail"
          nome="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Campo
          etichetta="Password"
          nome="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errore && <Avviso tipo="errore">{errore}</Avviso>}

        <Button type="submit" size="lg" disabled={inCorso}>
          {inCorso ? "Accesso in corso…" : "Accedi"}
        </Button>
      </form>
    </SchedaAccesso>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avviso } from "@/components/Avviso";
import { Button } from "@/components/ui/button";

// LogoutButton (RF_UE_2).
export function LogoutButton() {
  const router = useRouter();
  const [errore, setErrore] = useState("");
  const [inCorso, setInCorso] = useState(false);

  async function esci() {
    setErrore("");
    setInCorso(true);
    try {
      const risposta = await fetch("/api/auth/logout", { method: "POST" });
      // Si torna al login solo se la sessione è stata davvero chiusa.
      if (!risposta.ok) {
        setErrore("Uscita non riuscita, riprova.");
        return;
      }
      router.push("/login");
    } catch {
      setErrore("Servizio non raggiungibile, controlla la connessione e riprova.");
    } finally {
      setInCorso(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="ghost" size="lg" onClick={esci} disabled={inCorso}>
        {inCorso ? "Uscita in corso…" : "Esci"}
      </Button>
      {errore && <Avviso tipo="errore">{errore}</Avviso>}
    </div>
  );
}

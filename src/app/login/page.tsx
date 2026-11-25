"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

    const risposta = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setInCorso(false);
    if (!risposta.ok) {
      const dati = (await risposta.json().catch(() => ({}))) as { errore?: string };
      setErrore(dati.errore ?? "Accesso non riuscito.");
      return;
    }
    // Dopo il login si entra nell'area del proprio ruolo.
    const { area } = (await risposta.json()) as { area: string };
    router.push(area);
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Accedi a MindCompanion</h1>

      <form onSubmit={accedi} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-lg">
          E-mail
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-lg">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border px-3 py-2"
          />
        </label>

        {errore && (
          <p role="alert" className="text-lg text-red-700">
            {errore}
          </p>
        )}

        <Button type="submit" size="lg" disabled={inCorso}>
          {inCorso ? "Accesso in corso…" : "Accedi"}
        </Button>
      </form>
    </main>
  );
}

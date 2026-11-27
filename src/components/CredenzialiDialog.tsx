"use client";

import { Avviso } from "@/components/Avviso";
import { Button } from "@/components/ui/button";

export type Credenziali = { email: string; passwordTemporanea: string };

type CredenzialiDialogProps = { credenziali: Credenziali; onChiudi: () => void };

// CredenzialiStampabiliPage (RF_AD_12): foglio da consegnare all'utente, visibile solo in stampa.
function CredenzialiStampabiliPage({ credenziali }: { credenziali: Credenziali }) {
  return (
    <section className="hidden flex-col gap-4 text-lg text-black print:flex">
      <h1 className="text-2xl font-semibold">MindCompanion – Credenziali di accesso</h1>
      <p>E-mail: {credenziali.email}</p>
      <p>
        Password temporanea: <span className="font-mono">{credenziali.passwordTemporanea}</span>
      </p>
      <p>Al primo accesso la piattaforma ti chiederà di scegliere una nuova password.</p>
    </section>
  );
}

// CredenzialiDialog (RF_AD_1, RF_AD_12): le credenziali sono visibili solo finché resta aperta.
export function CredenzialiDialog({ credenziali, onChiudi }: CredenzialiDialogProps) {
  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 text-lg shadow-sm print:hidden">
        <Avviso tipo="successo">Utente registrato.</Avviso>
        <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
          <dt className="text-muted-foreground">E-mail</dt>
          <dd className="font-medium break-all">{credenziali.email}</dd>
          <dt className="text-muted-foreground">Password temporanea</dt>
          <dd className="font-mono font-medium">{credenziali.passwordTemporanea}</dd>
        </dl>
        <p className="text-base text-muted-foreground">
          Esporta le credenziali e consegnale all&apos;utente: dopo la chiusura la password non sarà più
          visibile.
        </p>
        <div className="flex flex-wrap gap-3">
          {/* EsportaCredenzialiButton: dalla finestra di stampa si stampa o si salva in PDF. */}
          <Button type="button" size="lg" onClick={() => window.print()}>
            Esporta credenziali
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={onChiudi}>
            Chiudi
          </Button>
        </div>
      </div>
      <CredenzialiStampabiliPage credenziali={credenziali} />
    </>
  );
}

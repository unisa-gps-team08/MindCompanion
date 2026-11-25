"use client";

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
      <div role="status" className="flex flex-col gap-3 rounded-lg border p-4 text-lg print:hidden">
        <p className="text-green-800">Utente registrato.</p>
        <p>E-mail: {credenziali.email}</p>
        <p>
          Password temporanea: <span className="font-mono">{credenziali.passwordTemporanea}</span>
        </p>
        <p className="text-base">
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

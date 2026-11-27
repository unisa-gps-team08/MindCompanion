import { Suspense } from "react";
import Link from "next/link";
import { GestioneAssociazioniPaziente } from "@/components/GestioneAssociazioniPaziente";

type ProprietaPagina = { params: Promise<{ id: string }> };

// Legge l'id dal percorso: con cacheComponents `params` è un dato dinamico e va letto dentro <Suspense>.
async function ContenutoAssociazioni({ params }: ProprietaPagina) {
  const { id } = await params;
  return <GestioneAssociazioniPaziente pazienteId={id} />;
}

// Pagina di ModificaAssociazioneUtente (RF_AD_10, SC_AD_7). L'accesso è riservato all'amministratore dal proxy.
// Vi si arriva dal pulsante "Gestisci associazioni" dell'elenco utenti (RF_AD_7).
export default function GestioneAssociazioniPage({ params }: ProprietaPagina) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Link href="/amministratore" className="text-lg underline underline-offset-4">
        ← Torna all&apos;elenco utenti
      </Link>
      <h1 className="text-2xl font-semibold">Gestione associazioni</h1>
      <Suspense fallback={<p className="text-lg">Caricamento…</p>}>
        <ContenutoAssociazioni params={params} />
      </Suspense>
    </section>
  );
}

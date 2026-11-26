import Link from "next/link";
import { GestioneAssociazioniPaziente } from "@/components/GestioneAssociazioniPaziente";

// Pagina di ModificaAssociazioneUtente (RF_AD_10, SC_AD_7). L'accesso è riservato all'amministratore dal proxy.
// Il link "Gestisci associazioni" dall'elenco utenti (RF_AD_7, issue #20) si aggiunge quando l'elenco sarà disponibile.
export default async function GestioneAssociazioniPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Link href="/amministratore/associazioni" className="text-lg underline underline-offset-4">
        ← Torna all&apos;elenco dei pazienti
      </Link>
      <h1 className="text-2xl font-semibold">Gestione associazioni</h1>
      <GestioneAssociazioniPaziente pazienteId={id} />
    </section>
  );
}

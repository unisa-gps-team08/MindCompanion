import Link from "next/link";
import { InserisciUtenteForm } from "@/components/InserisciUtenteForm";

// Pagina di InserisciUtente (RF_AD_1, SC_AD_1). L'accesso è riservato all'amministratore dal proxy.
export default function InserisciUtentePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <Link href="/amministratore" className="text-lg underline underline-offset-4">
        ← Torna all&apos;area amministratore
      </Link>
      <h1 className="text-2xl font-semibold">Aggiungi nuovo utente</h1>
      <InserisciUtenteForm />
    </main>
  );
}

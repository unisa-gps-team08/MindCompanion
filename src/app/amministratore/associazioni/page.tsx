import Link from "next/link";
import { ElencoPazientiAssociazioni } from "@/components/ElencoPazientiAssociazioni";

// Punto di accesso alla Gestione associazioni (RF_AD_10, RF_AD_11). Provvisoria fino all'Elenco utenti
// (RF_AD_7, issue #20), da cui UC_AD_1 prevede "Gestisci associazioni". L'accesso è riservato all'amministratore dal proxy.
export default function GestioneAssociazioniElencoPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Link href="/amministratore" className="text-lg underline underline-offset-4">
        ← Torna all&apos;area amministratore
      </Link>
      <h1 className="text-2xl font-semibold">Gestione associazioni</h1>
      <p className="text-lg">Scegli il paziente di cui vuoi gestire medico, nutrizionista e tutori.</p>
      <ElencoPazientiAssociazioni />
    </section>
  );
}

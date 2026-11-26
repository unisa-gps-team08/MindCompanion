import Link from "next/link";
import { AssegnaAssociazioniUtenteForm } from "@/components/AssegnaAssociazioniUtenteForm";

export default function AssegnaAssociazioniUtentePage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Link href="/amministratore" className="text-lg underline underline-offset-4">
        ← Torna all&apos;area amministratore
      </Link>
      <h1 className="text-2xl font-semibold">Gestione associazioni utenti</h1>
      <p>
        Seleziona un paziente, il ruolo della figura di supporto e l&apos;utente da associare.
        Ogni paziente può avere al massimo un medico, un nutrizionista e più tutori.
      </p>
      <AssegnaAssociazioniUtenteForm />
    </section>
  );
}

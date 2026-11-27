import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ModificaUtenteForm } from "@/components/ModificaUtenteForm";

// Ingresso della pagina, una sola volta: prima il titolo, poi la descrizione, poi la scheda.
// Si muove solo la posizione, non l'opacità: se il browser sospende le animazioni (scheda in
// background) il contenuto resta comunque visibile. Niente animazioni per chi le ha disattivate.
const INGRESSO =
  "animate-in slide-in-from-bottom-3 duration-700 ease-[cubic-bezier(.22,1,.36,1)] [animation-fill-mode:both] motion-reduce:animate-none";

// Pagina di ModificaUtente (RF_AD_2, SC_AD_2): ci si arriva dal pulsante "Modifica Utente"
// dell'elenco utenti (RF_AD_7). L'accesso è riservato all'amministratore dal proxy.
// Palette e font arrivano dal tema globale (globals.css, layout radice).
export default function ModificaUtentePage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-1 py-2 sm:py-4">
      <div className="flex flex-col gap-5">
        <Link
          href="/amministratore"
          className="group inline-flex w-fit items-center gap-2 rounded-md py-1 text-base font-medium text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <ArrowLeft aria-hidden className="size-5 transition-transform duration-150 group-hover:-translate-x-[3px]" />
          Torna all&apos;elenco utenti
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className={`${INGRESSO} text-4xl tracking-[-0.02em] sm:text-5xl`}>Modifica utente</h1>
          <p className={`${INGRESSO} text-lg text-muted-foreground [animation-delay:150ms]`}>
            Aggiorna i dati anagrafici e l&apos;e-mail di accesso. Il ruolo resta quello scelto alla registrazione.
          </p>
        </div>
      </div>

      <div className={`${INGRESSO} [animation-delay:300ms]`}>
        {/* Suspense: l'id arriva dall'URL solo a runtime, il resto della pagina resta statico. */}
        <Suspense fallback={<p className="text-lg text-muted-foreground">Caricamento…</p>}>
          <ModificaUtenteForm />
        </Suspense>
      </div>
    </section>
  );
}

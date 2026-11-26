import { ArrowLeft } from "lucide-react";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { ModificaUtenteForm } from "@/components/ModificaUtenteForm";

const fontTitoli = Source_Serif_4({ subsets: ["latin"], variable: "--font-titoli" });
const fontTesto = Libre_Franklin({ subsets: ["latin"], variable: "--font-testo" });

// Palette "teal on paper" per strutture sanitarie: fondo carta, inchiostro e azioni in verde
// petrolio. Sovrascrive i token del tema solo in questa pagina; i componenti (Button, campi) li leggono.
const TEMA = {
  "--background": "#ffffff",
  "--foreground": "#06525c",
  "--card": "#ffffff",
  "--primary": "#06525c",
  "--primary-foreground": "#f7f9f8",
  "--muted": "#ebf0ee",
  "--muted-foreground": "#2f737d",
  "--border": "#d6e1dd",
  "--input": "#c9d7d2",
  "--ring": "#06525c",
} as CSSProperties;

// Ingresso della pagina, una sola volta: prima il titolo, poi la descrizione, poi la scheda.
// Niente animazioni per chi le ha disattivate nel sistema operativo.
const INGRESSO =
  "animate-in fade-in slide-in-from-bottom-3 duration-700 ease-[cubic-bezier(.22,1,.36,1)] [animation-fill-mode:both] motion-reduce:animate-none";

// Pagina di ModificaUtente (RF_AD_2, SC_AD_2). L'accesso è riservato all'amministratore dal proxy.
// Il pulsante "Modifica Utente" che porta qui arriverà con l'elenco utenti (RF_AD_7, issue #20).
export default function ModificaUtentePage() {
  return (
    <div
      style={TEMA}
      className={`${fontTitoli.variable} ${fontTesto.variable} flex-1 bg-[#f7f9f8] text-foreground [font-family:var(--font-testo),system-ui,sans-serif]`}
    >
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-5">
          {/* Provvisorio: tornerà all'elenco utenti (RF_AD_7, issue #20). */}
          <Link
            href="/amministratore"
            className="group inline-flex w-fit items-center gap-2 rounded-md py-1 text-base font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <ArrowLeft aria-hidden className="size-5 transition-transform duration-150 group-hover:-translate-x-[3px]" />
            Torna all&apos;area amministratore
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className={`${INGRESSO} [font-family:var(--font-titoli),Georgia,serif] text-4xl tracking-[-0.02em] sm:text-5xl`}>
              Modifica utente
            </h1>
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
      </main>
    </div>
  );
}

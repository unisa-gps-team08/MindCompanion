import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Mail, Puzzle, TrendingUp, Users, Utensils } from "lucide-react";
import { BadgeRuolo } from "@/components/BadgeRuolo";
import { AvatarUtente } from "@/components/PannelloMenuUtente";
import { buttonVariants } from "@/components/ui/button";
import { calcolaIniziali } from "@/lib/navigazione";
import { formattaDataNascita, type PazienteAssociato } from "@/lib/validazioneRicercaPazienti";

export type IconaAzioneScheda = "alimentazione" | "esercizi" | "andamento" | "questionari";

export type AzioneSchedaPaziente = {
  titolo: string;
  descrizione: string;
  etichettaPulsante: string;
  percorsoRelativo: string;
  icona: IconaAzioneScheda;
};

type DettaglioAnagraficoPazienteProps = {
  paziente: PazienteAssociato;
  percorsoBaseScheda: string;
  azioni: readonly AzioneSchedaPaziente[];
};

const ICONE_AZIONE: Record<IconaAzioneScheda, ComponentType<SVGProps<SVGSVGElement>>> = {
  alimentazione: Utensils,
  esercizi: Puzzle,
  andamento: TrendingUp,
  questionari: ClipboardList,
};

function CampoAnagrafico({
  etichetta,
  valore,
  classeValore,
}: {
  etichetta: string;
  valore: string;
  classeValore?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{etichetta}</dt>
      <dd className={classeValore ?? "mt-0.5 text-sm text-foreground"}>{valore}</dd>
    </div>
  );
}

/**
 * Scheda riutilizzabile con i dati anagrafici principali del paziente, i tutori
 * associati e i collegamenti alle sezioni operative abilitate per il ruolo corrente.
 */
export function DettaglioAnagraficoPaziente({
  paziente,
  percorsoBaseScheda,
  azioni,
}: DettaglioAnagraficoPazienteProps) {
  const iniziali = calcolaIniziali(paziente.nome, paziente.cognome);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <AvatarUtente iniziali={iniziali} className="size-14 shrink-0" classeTesto="text-lg" />
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {paziente.cognome} {paziente.nome}
              </h1>
              <BadgeRuolo ruolo="PAZIENTE" />
            </div>
            <p className="font-mono text-xs tracking-wide text-muted-foreground">
              {paziente.codiceFiscale}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <section
          aria-labelledby="titolo-dati-anagrafici"
          className="rounded-xl border border-border bg-card p-5 shadow-xs"
        >
          <h2 id="titolo-dati-anagrafici" className="text-lg font-semibold">
            Dati anagrafici
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <CampoAnagrafico etichetta="Nome" valore={paziente.nome} classeValore="mt-0.5 text-sm font-medium text-foreground" />
            <CampoAnagrafico etichetta="Cognome" valore={paziente.cognome} classeValore="mt-0.5 text-sm font-medium text-foreground" />
            <CampoAnagrafico etichetta="Codice fiscale" valore={paziente.codiceFiscale} classeValore="mt-0.5 font-mono text-sm text-foreground" />
            <CampoAnagrafico etichetta="Data di nascita" valore={formattaDataNascita(paziente.dataNascita)} />
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                E-mail
              </dt>
              <dd className="mt-0.5 text-sm">
                <a
                  href={`mailto:${paziente.email}`}
                  className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                >
                  <Mail aria-hidden="true" className="size-3.5" />
                  <span>{paziente.email}</span>
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section
          aria-labelledby="titolo-tutori-associati"
          className="rounded-xl border border-border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="titolo-tutori-associati" className="text-lg font-semibold">
              Tutori associati
            </h2>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {paziente.tutori.length}
            </span>
          </div>

          {paziente.tutori.length === 0 ? (
            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
              <Users aria-hidden="true" className="size-4 shrink-0" />
              <span>Nessun tutore associato a questo paziente.</span>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-2.5">
              {paziente.tutori.map((tutore) => (
                <li
                  key={tutore.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background/60 px-3.5 py-2.5"
                >
                  <span className="text-sm font-medium text-foreground">
                    {tutore.cognome} {tutore.nome}
                  </span>
                  <a
                    href={`mailto:${tutore.email}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary underline-offset-4 hover:underline"
                  >
                    <Mail aria-hidden="true" className="size-3.5" />
                    <span>{tutore.email}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {azioni.length > 0 && (
        <section aria-labelledby="titolo-azioni-paziente" className="flex flex-col gap-3">
          <h2 id="titolo-azioni-paziente" className="text-lg font-semibold">
            Percorsi e documenti
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {azioni.map((azione) => {
              const Icona = ICONE_AZIONE[azione.icona];
              return (
                <article
                  key={azione.percorsoRelativo}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icona aria-hidden="true" className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold">{azione.titolo}</h3>
                      <p className="text-sm text-muted-foreground">{azione.descrizione}</p>
                    </div>
                  </div>
                  <div>
                    <Link
                      href={`${percorsoBaseScheda}/${paziente.id}/${azione.percorsoRelativo}`}
                      className={buttonVariants({ variant: "default", size: "default" })}
                    >
                      <span>{azione.etichettaPulsante}</span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

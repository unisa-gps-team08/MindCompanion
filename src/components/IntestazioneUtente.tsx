import { HeartHandshake, Salad, Stethoscope, UserRound, type LucideIcon } from "lucide-react";
import { ETICHETTE_RUOLO } from "@/components/InserisciUtenteForm";
import { isRuoloModificabile } from "@/lib/validazioneModificaUtente";

const ICONE_RUOLO: Record<string, LucideIcon> = {
  MEDICO: Stethoscope,
  NUTRIZIONISTA: Salad,
  TUTORE: HeartHandshake,
  PAZIENTE: UserRound,
};

type IntestazioneUtenteProps = { nome: string; cognome: string; email: string; ruolo: string };

// Scheda dell'utente in modifica (SC_AD_2: "il sistema mostra la scheda di Antonio"):
// iniziali, nome e ruolo, così l'amministratore vede subito chi sta modificando.
export function IntestazioneUtente({ nome, cognome, email, ruolo }: IntestazioneUtenteProps) {
  const Icona = ICONE_RUOLO[ruolo] ?? UserRound;
  const iniziali = `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground"
      >
        {iniziali}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate [font-family:var(--font-titoli,inherit)] text-2xl tracking-[-0.01em]">
          {nome} {cognome}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-sm font-medium text-foreground">
            <Icona aria-hidden className="size-4" />
            {isRuoloModificabile(ruolo) ? ETICHETTE_RUOLO[ruolo] : ruolo}
          </span>
          <span className="truncate">{email}</span>
        </div>
      </div>
    </div>
  );
}

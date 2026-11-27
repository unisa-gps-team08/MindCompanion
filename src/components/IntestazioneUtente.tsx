import { BadgeRuolo } from "@/components/BadgeRuolo";
import { isRuoloModificabile } from "@/lib/validazioneModificaUtente";

type IntestazioneUtenteProps = { nome: string; cognome: string; email: string; ruolo: string };

// Scheda dell'utente in modifica (SC_AD_2: "il sistema mostra la scheda di Antonio"):
// iniziali, nome e ruolo, così l'amministratore vede subito chi sta modificando.
export function IntestazioneUtente({ nome, cognome, email, ruolo }: IntestazioneUtenteProps) {
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
        <p className="truncate font-heading text-2xl tracking-[-0.01em] text-primary">
          {nome} {cognome}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted-foreground">
          {isRuoloModificabile(ruolo) && <BadgeRuolo ruolo={ruolo} className="text-sm" />}
          <span className="truncate">{email}</span>
        </div>
      </div>
    </div>
  );
}

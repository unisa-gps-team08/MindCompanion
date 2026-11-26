import {
  HeartHandshake,
  Salad,
  ShieldCheck,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ETICHETTE_RUOLO, type RuoloUtente } from "@/lib/navigazione";
import { cn } from "@/lib/utils";

const ICONE_RUOLO: Record<RuoloUtente, LucideIcon> = {
  AMMINISTRATORE: ShieldCheck,
  MEDICO: Stethoscope,
  NUTRIZIONISTA: Salad,
  TUTORE: HeartHandshake,
  PAZIENTE: UserRound,
};

type BadgeRuoloProps = {
  ruolo: RuoloUtente;
  modalitaPaziente?: boolean;
  className?: string;
};

// Pillola ruolo condivisa da menu utente e testata: coerenza visiva con IntestazioneUtente.
export function BadgeRuolo({
  ruolo,
  modalitaPaziente = false,
  className,
}: BadgeRuoloProps) {
  const Icona = ICONE_RUOLO[ruolo];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background font-medium text-foreground",
        modalitaPaziente
          ? "px-3 py-1 text-lg [&_svg]:size-5"
          : "px-2.5 py-0.5 text-xs [&_svg]:size-3.5",
        className,
      )}
    >
      <Icona aria-hidden="true" className="shrink-0 text-primary" />
      <span>{ETICHETTE_RUOLO[ruolo]}</span>
    </span>
  );
}

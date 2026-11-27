import type { ReactNode } from "react";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TipoAvviso = "errore" | "successo" | "informazione";

type AvvisoProps = {
  tipo: TipoAvviso;
  children: ReactNode;
  // Pulsante opzionale accanto al messaggio, es. "Riprova".
  azione?: ReactNode;
  className?: string;
};

const STILI: Record<TipoAvviso, { ruolo: string; classi: string; icona: typeof InfoIcon }> = {
  errore: {
    ruolo: "alert",
    classi: "border-destructive/30 bg-destructive/5 text-destructive",
    icona: CircleAlertIcon,
  },
  successo: {
    ruolo: "status",
    classi: "border-success/30 bg-success/5 text-success",
    icona: CircleCheckIcon,
  },
  informazione: {
    ruolo: "note",
    classi: "border-border bg-muted text-foreground",
    icona: InfoIcon,
  },
};

// Messaggio di esito con i colori del tema: un solo stile per errori, conferme e informazioni
// in tutta l'app. Gli errori usano role="alert" perché il lettore di schermo li annunci subito;
// le informazioni fisse usano role="note", perché non sono l'esito di un'azione.
export function Avviso({ tipo, children, azione, className }: AvvisoProps) {
  const { ruolo, classi, icona: Icona } = STILI[tipo];

  return (
    <div
      role={ruolo}
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 text-base",
        classi,
        className,
      )}
    >
      <Icona aria-hidden="true" className={cn("size-5 shrink-0", tipo === "informazione" && "text-primary")} />
      <div className="min-w-0 flex-1 font-medium">{children}</div>
      {azione}
    </div>
  );
}

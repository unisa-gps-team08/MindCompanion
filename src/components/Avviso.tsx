import type { ReactNode } from "react";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AvvisoProps = {
  tipo: "errore" | "successo";
  children: ReactNode;
  // Pulsante opzionale accanto al messaggio, es. "Riprova".
  azione?: ReactNode;
  className?: string;
};

// Messaggio di esito con i colori del tema: un solo stile per errori e conferme in tutta l'app.
// Gli errori usano role="alert" perché il lettore di schermo li annunci subito.
export function Avviso({ tipo, children, azione, className }: AvvisoProps) {
  const errore = tipo === "errore";
  const Icona = errore ? CircleAlertIcon : CircleCheckIcon;

  return (
    <div
      role={errore ? "alert" : "status"}
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 text-base",
        errore
          ? "border-destructive/30 bg-destructive/5 text-destructive"
          : "border-success/30 bg-success/5 text-success",
        className,
      )}
    >
      <Icona aria-hidden="true" className="size-5 shrink-0" />
      <div className="min-w-0 flex-1 font-medium">{children}</div>
      {azione}
    </div>
  );
}

import type { InputHTMLAttributes, ReactNode } from "react";

type CampoProps = InputHTMLAttributes<HTMLInputElement> & {
  etichetta: string;
  nome: string;
  errore?: string;
  suggerimento?: string;
};

// Campo di testo con etichetta, suggerimento ed errore, condiviso da InserisciUtenteForm e
// ModificaUtenteForm. Testo e campi grandi: tra gli utenti ci sono persone anziane (RNF di usabilità).
export function Campo({ etichetta, nome, errore, suggerimento, className, ...input }: CampoProps) {
  const idAiuto = `${nome}-aiuto`;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-base font-medium">{etichetta}</span>
      <input
        name={nome}
        aria-invalid={errore ? true : undefined}
        aria-describedby={errore || suggerimento ? idAiuto : undefined}
        className={`h-12 rounded-lg border border-input bg-background px-3.5 text-lg shadow-xs transition-[border-color,box-shadow] outline-none hover:border-foreground/30 focus-visible:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-red-700 aria-invalid:ring-red-700/15 ${className ?? ""}`}
        {...input}
      />
      {errore ? (
        <span id={idAiuto} className="text-sm font-medium text-red-700">
          {errore}
        </span>
      ) : (
        suggerimento && (
          <span id={idAiuto} className="text-sm text-muted-foreground">
            {suggerimento}
          </span>
        )
      )}
    </label>
  );
}

// Gruppo di campi con titolo: divide un form lungo in blocchi che si leggono a colpo d'occhio.
export function SezioneForm({ titolo, children }: { titolo: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <legend className="float-left mb-4 w-full text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {titolo}
      </legend>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type CampoPasswordProps = {
  nome: string;
  etichetta: string;
  autoComplete: string;
  valore: string;
  errore?: string;
  minLength?: number;
  onCambia: (valore: string) => void;
};

// Campo password con il pulsante per mostrare il testo mentre si scrive (RF_UE_3).
export function CampoPassword({
  nome,
  etichetta,
  autoComplete,
  valore,
  errore,
  minLength,
  onCambia,
}: CampoPasswordProps) {
  const [visibile, setVisibile] = useState(false);
  const idCampo = `campo-${nome}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idCampo} className="text-base font-medium">
        {etichetta}
      </label>
      <div className="relative">
        <input
          id={idCampo}
          type={visibile ? "text" : "password"}
          name={nome}
          required
          autoComplete={autoComplete}
          minLength={minLength}
          value={valore}
          onChange={(e) => onCambia(e.target.value)}
          aria-invalid={errore ? true : undefined}
          aria-describedby={errore ? `${idCampo}-errore` : undefined}
          className="h-12 w-full rounded-lg border border-input bg-background pr-12 pl-3.5 text-lg shadow-xs transition-[border-color,box-shadow] outline-none hover:border-foreground/30 focus-visible:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-destructive/15"
        />
        <button
          type="button"
          onClick={() => setVisibile((precedente) => !precedente)}
          aria-label={visibile ? `Nascondi ${etichetta.toLowerCase()}` : `Mostra ${etichetta.toLowerCase()}`}
          aria-pressed={visibile}
          aria-controls={idCampo}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {visibile ? <EyeOffIcon className="size-5" aria-hidden="true" /> : <EyeIcon className="size-5" aria-hidden="true" />}
        </button>
      </div>
      {errore && (
        <span id={`${idCampo}-errore`} className="text-sm font-medium text-destructive">
          {errore}
        </span>
      )}
    </div>
  );
}

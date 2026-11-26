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
    <div className="flex flex-col gap-1">
      <label htmlFor={idCampo}>{etichetta}</label>
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
          className="w-full rounded-lg border py-2 pr-12 pl-3 aria-invalid:border-red-700"
        />
        <button
          type="button"
          onClick={() => setVisibile((precedente) => !precedente)}
          aria-label={visibile ? `Nascondi ${etichetta.toLowerCase()}` : `Mostra ${etichetta.toLowerCase()}`}
          aria-pressed={visibile}
          aria-controls={idCampo}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground"
        >
          {visibile ? <EyeOffIcon className="size-5" aria-hidden="true" /> : <EyeIcon className="size-5" aria-hidden="true" />}
        </button>
      </div>
      {errore && <span className="text-sm text-red-700">{errore}</span>}
    </div>
  );
}

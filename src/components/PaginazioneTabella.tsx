"use client";

import { Button } from "@/components/ui/button";

const RIGHE_PER_PAGINA_OPZIONI = [5, 10, 20, 50] as const;

type PaginazioneTabellaProps = {
  pageIndex: number;
  pageSize: number;
  totaleRighe: number;
  totalePagine: number;
  puoIndietro: boolean;
  puoAvanti: boolean;
  onPrimaPagina: () => void;
  onPaginaPrecedente: () => void;
  onPaginaSuccessiva: () => void;
  onUltimaPagina: () => void;
  onCambiaDimensione: (dimensione: number) => void;
};

/** Controlli di paginazione per la Data Table dell'elenco utenti (RF_AD_7). */
export function PaginazioneTabella({
  pageIndex,
  pageSize,
  totaleRighe,
  totalePagine,
  puoIndietro,
  puoAvanti,
  onPrimaPagina,
  onPaginaPrecedente,
  onPaginaSuccessiva,
  onUltimaPagina,
  onCambiaDimensione,
}: PaginazioneTabellaProps) {
  const primoElemento = totaleRighe === 0 ? 0 : pageIndex * pageSize + 1;
  const ultimoElemento = Math.min(totaleRighe, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <p>
        {totaleRighe === 0
          ? "Nessun utente da visualizzare"
          : `Mostrati ${primoElemento}–${ultimoElemento} di ${totaleRighe} utenti`}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span>Righe per pagina</span>
          <select
            value={pageSize}
            onChange={(e) => onCambiaDimensione(Number(e.target.value))}
            aria-label="Righe per pagina"
            className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {RIGHE_PER_PAGINA_OPZIONI.map((opzione) => (
              <option key={opzione} value={opzione}>
                {opzione}
              </option>
            ))}
          </select>
        </label>

        <span className="whitespace-nowrap">
          Pagina {pageIndex + 1} di {totalePagine}
        </span>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={onPrimaPagina} disabled={!puoIndietro}>
            Prima
          </Button>
          <Button variant="outline" size="sm" onClick={onPaginaPrecedente} disabled={!puoIndietro}>
            Precedente
          </Button>
          <Button variant="outline" size="sm" onClick={onPaginaSuccessiva} disabled={!puoAvanti}>
            Successiva
          </Button>
          <Button variant="outline" size="sm" onClick={onUltimaPagina} disabled={!puoAvanti}>
            Ultima
          </Button>
        </div>
      </div>
    </div>
  );
}

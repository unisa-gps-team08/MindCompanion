import type { PastoInserito } from "@/lib/pianoAlimentare";

type PastoLetturaProps = {
  titolo: string;
  pasto?: PastoInserito;
};

// Un pasto del piano in sola lettura (vista giornaliera, SC_NT_4): alimenti con la loro porzione.
export function PastoLettura({ titolo, pasto }: PastoLetturaProps) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
      <h3 className="text-lg font-semibold">{titolo}</h3>
      {pasto && pasto.alimenti.length > 0 ? (
        <ul className="flex flex-col divide-y">
          {pasto.alimenti.map((alimento, indice) => (
            <li key={`${alimento}-${indice}`} className="flex items-baseline justify-between gap-4 py-2">
              <span className="min-w-0 break-words">{alimento}</span>
              <span className="shrink-0 text-muted-foreground">{pasto.porzioni[indice]}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Nessun alimento previsto.</p>
      )}
    </article>
  );
}

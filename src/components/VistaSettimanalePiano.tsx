import {
  chiavePasto,
  ETICHETTE_GIORNO,
  ETICHETTE_PASTO,
  GIORNI_SETTIMANA,
  TIPI_PASTO,
  type PastoInserito,
} from "@/lib/pianoAlimentare";

type VistaSettimanalePianoProps = {
  /** Pasti indicizzati con chiavePasto(giorno, tipo). */
  pastiPerChiave: ReadonlyMap<string, PastoInserito>;
};

// Vista settimanale del piano (SC_NT_4): una tabella giorni × pasti. Su schermi stretti
// scorre in orizzontale dentro il suo riquadro, senza allargare la pagina.
export function VistaSettimanalePiano({ pastiPerChiave }: VistaSettimanalePianoProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card [contain:inline-size]">
      <table className="w-full min-w-[48rem] border-collapse text-left text-base">
        <caption className="sr-only">Piano alimentare della settimana, giorni per pasti</caption>
        <thead>
          <tr className="border-b bg-muted">
            <th scope="col" className="px-4 py-3 font-semibold">
              Giorno
            </th>
            {TIPI_PASTO.map((tipo) => (
              <th key={tipo} scope="col" className="px-4 py-3 font-semibold">
                {ETICHETTE_PASTO[tipo]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GIORNI_SETTIMANA.map((giorno) => (
            <tr key={giorno} className="border-b align-top last:border-b-0">
              <th scope="row" className="px-4 py-3 font-semibold">
                {ETICHETTE_GIORNO[giorno]}
              </th>
              {TIPI_PASTO.map((tipo) => {
                const pasto = pastiPerChiave.get(chiavePasto(giorno, tipo));
                return (
                  <td key={tipo} className="px-4 py-3">
                    {pasto ? (
                      <ul className="flex flex-col gap-1">
                        {pasto.alimenti.map((alimento, indice) => (
                          <li key={`${alimento}-${indice}`}>
                            {alimento}{" "}
                            <span className="text-muted-foreground">({pasto.porzioni[indice]})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

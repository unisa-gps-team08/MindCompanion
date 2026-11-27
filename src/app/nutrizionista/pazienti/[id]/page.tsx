import { Suspense } from "react";
import type { AzioneSchedaPaziente } from "@/components/DettaglioAnagraficoPaziente";
import { SchedaPazientePage } from "@/components/SchedaPazientePage";
import { Skeleton } from "@/components/ui/skeleton";

const AZIONI_NUTRIZIONISTA: readonly AzioneSchedaPaziente[] = [
  {
    titolo: "Piano alimentare",
    descrizione:
      "Consulta o gestisci il piano alimentare settimanale e le raccomandazioni del paziente.",
    etichettaPulsante: "Apri piano alimentare",
    percorsoRelativo: "piano-alimentare",
    icona: "alimentazione",
  },
];

function FallbackSchedaPaziente() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    </section>
  );
}

async function ContenutoSchedaNutrizionista({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SchedaPazientePage
      pazienteId={id}
      endpointApiBase="/api/nutritionist/patients"
      percorsoElenco="/nutrizionista"
      percorsoBaseScheda="/nutrizionista/pazienti"
      etichettaElenco="I miei pazienti"
      azioni={AZIONI_NUTRIZIONISTA}
    />
  );
}

// Scheda anagrafica del paziente associato al nutrizionista (RF_NT_6).
export default function SchedaPazienteNutrizionistaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<FallbackSchedaPaziente />}>
      <ContenutoSchedaNutrizionista params={params} />
    </Suspense>
  );
}

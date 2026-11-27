import { Suspense } from "react";
import { SchedaPazienteNutrizionista } from "@/components/SchedaPazienteNutrizionista";
import { Skeleton } from "@/components/ui/skeleton";

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

  return <SchedaPazienteNutrizionista pazienteId={id} />;
}

// Scheda anagrafica del paziente associato al nutrizionista (RF_NT_6), con l'azione sul piano
// alimentare che dipende dalla presenza del piano (RF_NT_1, RF_NT_5).
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

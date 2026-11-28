import Link from "next/link";
import { Suspense } from "react";
import { ModificaPianoAlimentarePage } from "@/components/ModificaPianoAlimentarePage";
import { Skeleton } from "@/components/ui/skeleton";

type ParametriPagina = { params: Promise<{ id: string }> };

// L'id del paziente è noto solo a runtime: link e form si leggono dentro Suspense.
async function ContenutoModifica({ params }: ParametriPagina) {
  const { id } = await params;

  return (
    <>
      <Link
        href={`/nutrizionista/pazienti/${encodeURIComponent(id)}/piano-alimentare`}
        className="inline-flex min-h-11 items-center self-start text-lg underline underline-offset-4"
      >
        ← Torna al piano alimentare
      </Link>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Modifica piano alimentare</h1>
        <p className="text-lg text-muted-foreground">
          Aggiorna pasti e raccomandazioni: si salvano solo i pasti con almeno un alimento.
        </p>
      </div>
      <ModificaPianoAlimentarePage pazienteId={id} />
    </>
  );
}

// Pagina di ModificaPianoAlimentare (RF_NT_4, SC_NT_3). Il proxy riserva l'area al
// nutrizionista; l'API verifica l'associazione con il paziente prima di leggere e salvare.
export default function ModificaPianoAlimentareNutrizionistaPage({ params }: ParametriPagina) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
        <ContenutoModifica params={params} />
      </Suspense>
    </section>
  );
}

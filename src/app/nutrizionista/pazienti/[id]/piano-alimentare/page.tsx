import Link from "next/link";
import { Suspense } from "react";
import { VisualizzaPianoAlimentarePage } from "@/components/VisualizzaPianoAlimentarePage";
import { Skeleton } from "@/components/ui/skeleton";

type ParametriPagina = { params: Promise<{ id: string }> };

// L'id del paziente è noto solo a runtime: link e contenuto si leggono dentro Suspense.
async function ContenutoPiano({ params }: ParametriPagina) {
  const { id } = await params;
  const percorsoScheda = `/nutrizionista/pazienti/${encodeURIComponent(id)}`;

  return (
    <>
      <Link href={percorsoScheda} className="inline-flex min-h-11 items-center self-start text-lg underline underline-offset-4">
        ← Torna alla scheda paziente
      </Link>
      <h1 className="text-2xl font-semibold">Piano alimentare</h1>
      <VisualizzaPianoAlimentarePage
        pazienteId={id}
        endpointApiBase="/api/nutritionist/patients"
        percorsoScheda={percorsoScheda}
        gestionePiano
      />
    </>
  );
}

// Pagina del piano alimentare del paziente lato nutrizionista (RF_NT_7, SC_NT_4). La scheda
// paziente (RF_NT_6) porta qui; il proxy riserva l'area al nutrizionista e l'API verifica
// l'associazione con il paziente.
export default function PianoAlimentareNutrizionistaPage({ params }: ParametriPagina) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
        <ContenutoPiano params={params} />
      </Suspense>
    </section>
  );
}

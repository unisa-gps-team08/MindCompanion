import Link from "next/link";
import { Suspense } from "react";
import { CreaPianoAlimentareForm } from "@/components/CreaPianoAlimentareForm";

type ParametriPagina = { params: Promise<{ id: string }> };

// L'id del paziente è noto solo a runtime: il form si legge dentro Suspense, così il resto
// della pagina si mostra subito.
async function FormDelPaziente({ params }: ParametriPagina) {
  const { id } = await params;
  return <CreaPianoAlimentareForm pazienteId={id} />;
}

// Pagina di CreaPianoAlimentare (RF_NT_1, UI_NT_1). Il proxy riserva l'area al nutrizionista;
// l'API verifica che il paziente sia associato a lui prima di salvare.
export default function CreaPianoAlimentarePage({ params }: ParametriPagina) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
      <Link href="/nutrizionista" className="inline-flex min-h-11 items-center self-start text-lg underline underline-offset-4">
        ← Torna ai pazienti
      </Link>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Crea piano alimentare</h1>
        <p className="text-lg text-muted-foreground">
          Compila i pasti giorno per giorno: si pubblicano solo quelli con almeno un alimento.
        </p>
      </div>
      <Suspense fallback={<p className="text-lg">Caricamento del form…</p>}>
        <FormDelPaziente params={params} />
      </Suspense>
    </section>
  );
}

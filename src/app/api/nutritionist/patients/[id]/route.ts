import { connectDB } from "@/db/connect";
import { trovaPazienteAssociato } from "@/db/models/Paziente";
import { richiediRuolo } from "@/lib/autorizzazione";

type ContestoRoute = {
  params: Promise<{ id: string }>;
};

const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };

/**
 * Scheda paziente del nutrizionista (RF_NT_6): restituisce i dati anagrafici di base e
 * i tutori solo se il paziente è associato al nutrizionista autenticato, altrimenti 403.
 */
export async function GET(_request: Request, { params }: ContestoRoute) {
  try {
    const { utente, risposta } = await richiediRuolo("NUTRIZIONISTA");
    if (risposta) return risposta;

    const { id } = await params;
    await connectDB();
    const paziente = await trovaPazienteAssociato("nutrizionista", utente._id.toString(), id);

    if (!paziente) {
      return Response.json(
        { errore: "Accesso negato: il paziente non è associato al tuo profilo." },
        { status: 403, headers: INTESTAZIONI_NO_CACHE },
      );
    }

    return Response.json({ paziente }, { headers: INTESTAZIONI_NO_CACHE });
  } catch {
    return Response.json(
      { errore: "Servizio non disponibile, riprova più tardi." },
      { status: 503, headers: INTESTAZIONI_NO_CACHE },
    );
  }
}

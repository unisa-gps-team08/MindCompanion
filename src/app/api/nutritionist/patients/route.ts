import { connectDB } from "@/db/connect";
import { cercaPazientiAssociati } from "@/db/models/Paziente";
import { richiediRuolo } from "@/lib/autorizzazione";
import { validaRicercaPazienti } from "@/lib/validazioneRicercaPazienti";

const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };

/**
 * VisualizzaElencoPazientiAssociati (RF_NT_6): restituisce i pazienti associati al
 * nutrizionista autenticato con i relativi tutori, filtrabili tramite `search`.
 */
export async function GET(request: Request) {
  try {
    const { utente, risposta } = await richiediRuolo("NUTRIZIONISTA");
    if (risposta) return risposta;

    const { searchParams } = new URL(request.url);
    const esito = validaRicercaPazienti(searchParams);
    if (!esito.valido) {
      return Response.json(
        { errore: esito.errore },
        { status: 400, headers: INTESTAZIONI_NO_CACHE },
      );
    }

    await connectDB();
    const pazienti = await cercaPazientiAssociati(
      "nutrizionista",
      utente._id.toString(),
      esito.search,
    );
    return Response.json({ pazienti }, { headers: INTESTAZIONI_NO_CACHE });
  } catch {
    return Response.json(
      { errore: "Servizio non disponibile, riprova più tardi." },
      { status: 503, headers: INTESTAZIONI_NO_CACHE },
    );
  }
}

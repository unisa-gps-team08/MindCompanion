import { connectDB } from "@/db/connect";
import { cambiaPassword, RUOLI } from "@/db/models/Utente";
import { getAreaRuolo } from "@/lib/aree";
import { richiediRuolo } from "@/lib/autorizzazione";
import { eliminaAltreSessioni } from "@/lib/sessione";
import { validaCambioPassword } from "@/lib/validazioneCambioPassword";

// CambiaPasswordControl (RF_UE_3, RF_UE_4): ogni utente autenticato cambia solo la propria password.
export async function POST(request: Request) {
  const { utente, risposta } = await richiediRuolo(...RUOLI);
  if (risposta) return risposta;

  const esito = validaCambioPassword(await request.json().catch(() => null));
  if (!esito.valido) {
    return Response.json({ errore: "Controlla i campi evidenziati.", campi: esito.errori }, { status: 400 });
  }

  try {
    await connectDB();
    const { passwordAttuale, nuovaPassword } = esito.valori;
    if (!(await cambiaPassword(utente._id.toString(), passwordAttuale, nuovaPassword))) {
      return Response.json(
        { errore: "Controlla i campi evidenziati.", campi: { passwordAttuale: "La password attuale non è corretta." } },
        { status: 400 },
      );
    }
    await eliminaAltreSessioni(utente._id.toString());
    return Response.json({ area: getAreaRuolo(utente.ruolo) });
  } catch {
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

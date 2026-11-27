import { connectDB } from "@/db/connect";
import { Paziente } from "@/db/models/Paziente";
import { creaPianoAlimentare, PianoAlimentare } from "@/db/models/PianoAlimentare";
import { richiediRuolo } from "@/lib/autorizzazione";
import { validaPianoAlimentare } from "@/lib/validazionePianoAlimentare";

// Stesso messaggio per un id inesistente e per un paziente di un altro nutrizionista:
// la risposta non rivela se il paziente esiste.
const MESSAGGIO_PAZIENTE_NON_TROVATO = "Paziente non trovato tra i tuoi pazienti.";
const MESSAGGIO_PIANO_ESISTENTE =
  "Il paziente ha già un piano alimentare. Per cambiarlo usa Modifica piano alimentare.";
const REGEX_ID = /^[a-f0-9]{24}$/i;

type Contesto = { params: Promise<{ id: string }> };

// Due richieste quasi contemporanee possono superare il controllo: l'indice univoco su paziente le blocca.
function isChiaveDuplicata(errore: unknown): boolean {
  return typeof errore === "object" && errore !== null && "code" in errore && errore.code === 11000;
}

// CreaPianoAlimentareControl (RF_NT_1): solo il nutrizionista associato al paziente (RF_AD_8)
// crea il suo piano alimentare, al massimo uno per paziente.
export async function POST(request: Request, { params }: Contesto) {
  const { utente, risposta } = await richiediRuolo("NUTRIZIONISTA");
  if (risposta) return risposta;

  const { id } = await params;
  if (!REGEX_ID.test(id)) {
    return Response.json({ errore: MESSAGGIO_PAZIENTE_NON_TROVATO }, { status: 404 });
  }

  const esito = validaPianoAlimentare(await request.json().catch(() => null));
  if (!esito.valido) {
    return Response.json({ errore: "Controlla i campi evidenziati.", campi: esito.errori }, { status: 400 });
  }

  try {
    await connectDB();
    const paziente = await Paziente.exists({ _id: id, nutrizionista: utente._id });
    if (!paziente) {
      return Response.json({ errore: MESSAGGIO_PAZIENTE_NON_TROVATO }, { status: 404 });
    }
    if (await PianoAlimentare.exists({ paziente: id })) {
      return Response.json({ errore: MESSAGGIO_PIANO_ESISTENTE }, { status: 409 });
    }

    const piano = await creaPianoAlimentare(id, esito.valori);
    return Response.json({ id: piano._id.toString() }, { status: 201 });
  } catch (errore) {
    if (isChiaveDuplicata(errore)) {
      return Response.json({ errore: MESSAGGIO_PIANO_ESISTENTE }, { status: 409 });
    }
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

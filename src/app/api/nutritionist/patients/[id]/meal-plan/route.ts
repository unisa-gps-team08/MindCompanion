import { connectDB } from "@/db/connect";
import { Paziente } from "@/db/models/Paziente";
import { leggiPianoAlimentare, PianoAlimentare, salvaPiano } from "@/db/models/PianoAlimentare";
import { richiediRuolo } from "@/lib/autorizzazione";
import { validaPianoAlimentare } from "@/lib/validazionePianoAlimentare";

// Come la scheda paziente (RF_NT_6): 403 con lo stesso messaggio per id non valido, paziente
// inesistente o associato a un altro nutrizionista, così la risposta non rivela se esiste.
const MESSAGGIO_PAZIENTE_NON_ASSOCIATO = "Accesso negato: il paziente non è associato al tuo profilo.";
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
    return Response.json({ errore: MESSAGGIO_PAZIENTE_NON_ASSOCIATO }, { status: 403 });
  }

  const esito = validaPianoAlimentare(await request.json().catch(() => null));
  if (!esito.valido) {
    return Response.json({ errore: "Controlla i campi evidenziati.", campi: esito.errori }, { status: 400 });
  }

  try {
    await connectDB();
    const paziente = await Paziente.exists({ _id: id, nutrizionista: utente._id });
    if (!paziente) {
      return Response.json({ errore: MESSAGGIO_PAZIENTE_NON_ASSOCIATO }, { status: 403 });
    }
    if (await PianoAlimentare.exists({ paziente: id })) {
      return Response.json({ errore: MESSAGGIO_PIANO_ESISTENTE }, { status: 409 });
    }

    const { pasti, raccomandazioniIdriche, raccomandazioniNutrizionali } = esito.valori;
    const piano = await salvaPiano(id, pasti, raccomandazioniIdriche, raccomandazioniNutrizionali);
    return Response.json({ id: piano._id.toString() }, { status: 201 });
  } catch (errore) {
    if (isChiaveDuplicata(errore)) {
      return Response.json({ errore: MESSAGGIO_PIANO_ESISTENTE }, { status: 409 });
    }
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

// I dati sanitari del piano non vanno in cache.
const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };

// VisualizzaPianoAlimentareControl (RF_NT_7): il nutrizionista associato legge il piano
// decifrato del paziente; 404 con pianoAssente se il paziente non ha ancora un piano.
export async function GET(_request: Request, { params }: Contesto) {
  const { utente, risposta } = await richiediRuolo("NUTRIZIONISTA");
  if (risposta) return risposta;

  const { id } = await params;
  if (!REGEX_ID.test(id)) {
    return Response.json({ errore: MESSAGGIO_PAZIENTE_NON_ASSOCIATO }, { status: 403, headers: INTESTAZIONI_NO_CACHE });
  }

  try {
    await connectDB();
    if (!(await Paziente.exists({ _id: id, nutrizionista: utente._id }))) {
      return Response.json({ errore: MESSAGGIO_PAZIENTE_NON_ASSOCIATO }, { status: 403, headers: INTESTAZIONI_NO_CACHE });
    }

    // Due letture distinte: l'associazione sta nella collezione utenti, il piano in
    // pianiAlimentari. Lo stesso controllo precede la creazione (POST).
    const piano = await leggiPianoAlimentare(id);
    if (!piano) {
      return Response.json(
        { errore: "Il paziente non ha ancora un piano alimentare.", pianoAssente: true },
        { status: 404, headers: INTESTAZIONI_NO_CACHE },
      );
    }
    return Response.json({ piano }, { headers: INTESTAZIONI_NO_CACHE });
  } catch {
    return Response.json(
      { errore: "Servizio non disponibile, riprova più tardi." },
      { status: 503, headers: INTESTAZIONI_NO_CACHE },
    );
  }
}

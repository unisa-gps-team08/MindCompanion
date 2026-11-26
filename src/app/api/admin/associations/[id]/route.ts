import { Types } from "mongoose";
import { connectDB } from "@/db/connect";
import { Paziente } from "@/db/models/Paziente";
import { Utente } from "@/db/models/Utente";
import { richiediRuolo } from "@/lib/autorizzazione";
import {
  isIdValido,
  RUOLI_FIGURA,
  validaRichiestaAssociazione,
  validaRimozioneAssociazione,
  type AssociazioniPazienteAttuali,
  type FiguraDisponibile,
} from "@/lib/associazioniPaziente";

type ContestoRoute = { params: Promise<{ id: string }> };

type DatiPaziente = {
  nome: string;
  cognome: string;
  medico?: Types.ObjectId | null;
  nutrizionista?: Types.ObjectId | null;
  tutori?: Types.ObjectId[];
};

type DatiFigura = Omit<FiguraDisponibile, "id"> & { _id: Types.ObjectId };

const pazienteNonTrovato = () => Response.json({ errore: "Paziente non trovato." }, { status: 404 });
const servizioNonDisponibile = () =>
  Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });

/** Legge le associazioni attuali del paziente (solo dati anagrafici), oppure null se non esiste. */
async function leggiAssociazioni(id: string): Promise<AssociazioniPazienteAttuali | null> {
  const paziente = await Paziente.findById(id)
    .select("nome cognome medico nutrizionista tutori")
    .lean<DatiPaziente>();
  if (!paziente) return null;

  return {
    pazienteId: id,
    nomePaziente: paziente.nome,
    cognomePaziente: paziente.cognome,
    medicoId: paziente.medico ? String(paziente.medico) : null,
    nutrizionistaId: paziente.nutrizionista ? String(paziente.nutrizionista) : null,
    tutoriIds: (paziente.tutori ?? []).map(String),
  };
}

// ModificaAssociazioneUtenteControl (RF_AD_10, nel RAD precedente RF_AD_12): dati per il form.
export async function GET(_request: Request, { params }: ContestoRoute) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const { id } = await params;
  if (!isIdValido(id)) return pazienteNonTrovato();

  try {
    await connectDB();
    const associazioni = await leggiAssociazioni(id);
    if (!associazioni) return pazienteNonTrovato();

    const figure = await Utente.find({ ruolo: { $in: RUOLI_FIGURA } })
      .select("nome cognome codiceFiscale email ruolo")
      .sort({ cognome: 1, nome: 1 })
      .lean<DatiFigura[]>();
    const utentiDisponibili: FiguraDisponibile[] = figure.map(({ _id, ...dati }) => ({ id: String(_id), ...dati }));

    return Response.json({ associazioni, utentiDisponibili });
  } catch {
    return servizioNonDisponibile();
  }
}

// ModificaAssociazioneUtenteControl (RF_AD_10): solo l'amministratore (RNF_FUN_3).
// Medico e nutrizionista: un solo valore, quindi la sostituzione rispetta 0..1 per costruzione.
// Tutori: elenco completo, senza duplicati e solo utenti con ruolo TUTORE (RF_AD_8).
export async function PUT(request: Request, { params }: ContestoRoute) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const { id } = await params;
  if (!isIdValido(id)) return pazienteNonTrovato();

  const esito = validaRichiestaAssociazione(await request.json().catch(() => null));
  if (!esito.valido) return Response.json({ errore: esito.errore }, { status: 400 });
  const { richiesta } = esito;

  try {
    await connectDB();
    if (!(await Paziente.exists({ _id: id }))) return pazienteNonTrovato();

    let aggiornamento: Record<string, Types.ObjectId | Types.ObjectId[]>;
    if (richiesta.ruoloFigura === "TUTORE") {
      const trovati = await Utente.countDocuments({ _id: { $in: richiesta.tutoriIds }, ruolo: "TUTORE" });
      if (trovati !== richiesta.tutoriIds.length) {
        return Response.json({ errore: "Uno o più utenti selezionati non sono tutori." }, { status: 400 });
      }
      aggiornamento = { tutori: richiesta.tutoriIds.map((tutoreId) => new Types.ObjectId(tutoreId)) };
    } else {
      const campo = richiesta.ruoloFigura === "MEDICO" ? "medico" : "nutrizionista";
      if (!(await Utente.exists({ _id: richiesta.nuovoIdFigura, ruolo: richiesta.ruoloFigura }))) {
        return Response.json(
          { errore: `L'utente selezionato non esiste o non ha il ruolo ${richiesta.ruoloFigura}.` },
          { status: 400 },
        );
      }
      aggiornamento = { [campo]: new Types.ObjectId(richiesta.nuovoIdFigura) };
    }

    // Un solo documento: l'aggiornamento è atomico, senza transazione (il MongoDB locale non è un replica set).
    await Paziente.updateOne({ _id: id }, { $set: aggiornamento });

    return Response.json({ messaggio: "Associazione aggiornata con successo.", associazioni: await leggiAssociazioni(id) });
  } catch {
    return servizioNonDisponibile();
  }
}

// RimuoviAssociazioneUtenteControl (RF_AD_11, nel RAD precedente RF_AD_13): solo l'amministratore (RNF_FUN_3).
// Query: ?ruoloFigura=MEDICO|NUTRIZIONISTA|TUTORE[&tutoreId=...] (tutoreId solo per i tutori).
// Si toglie solo il legame dal paziente: gli account, e il piano alimentare, restano.
export async function DELETE(request: Request, { params }: ContestoRoute) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const { id } = await params;
  if (!isIdValido(id)) return pazienteNonTrovato();

  const parametri = new URL(request.url).searchParams;
  const esito = validaRimozioneAssociazione(parametri.get("ruoloFigura"), parametri.get("tutoreId"));
  if (!esito.valido) return Response.json({ errore: esito.errore }, { status: 400 });
  const { richiesta } = esito;

  try {
    await connectDB();
    if (!(await Paziente.exists({ _id: id }))) return pazienteNonTrovato();

    // Il filtro contiene anche l'associazione da togliere: se non c'è, nessun documento corrisponde.
    // Il controllo e la modifica sono un'unica operazione atomica, senza transazione.
    let rimossa;
    if (richiesta.ruoloFigura === "TUTORE") {
      const tutoreId = new Types.ObjectId(richiesta.tutoreId);
      rimossa = await Paziente.updateOne({ _id: id, tutori: tutoreId }, { $pull: { tutori: tutoreId } });
    } else if (richiesta.ruoloFigura === "MEDICO") {
      rimossa = await Paziente.updateOne({ _id: id, medico: { $ne: null } }, { $set: { medico: null } });
    } else {
      rimossa = await Paziente.updateOne(
        { _id: id, nutrizionista: { $ne: null } },
        { $set: { nutrizionista: null } },
      );
    }

    if (rimossa.matchedCount === 0) {
      const messaggio =
        richiesta.ruoloFigura === "TUTORE"
          ? "Il tutore indicato non risulta associato al paziente."
          : `Nessun ${richiesta.ruoloFigura.toLowerCase()} associato da rimuovere.`;
      return Response.json({ errore: messaggio }, { status: 404 });
    }

    return Response.json({
      messaggio: "Associazione rimossa. Gli account utente non sono stati eliminati.",
      associazioni: await leggiAssociazioni(id),
    });
  } catch {
    return servizioNonDisponibile();
  }
}

import { connectDB } from "@/db/connect";
import { Utente, verificaCredenziali } from "@/db/models/Utente";
import { creaSessione } from "@/lib/sessione";

// AutenticazioneControl, login (RF_UE_1).
export async function POST(request: Request) {
  const dati: unknown = await request.json().catch(() => null);
  const { email, password } = (dati ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Response.json({ errore: "Inserisci e-mail e password." }, { status: 400 });
  }

  try {
    await connectDB();

    // Stesso messaggio per e-mail e password errate: non si rivela quali e-mail esistono.
    if (!(await verificaCredenziali(email, password))) {
      return Response.json({ errore: "E-mail o password non corrette." }, { status: 401 });
    }

    const utente = await Utente.findOne({ email: email.trim().toLowerCase() });
    if (!utente) {
      return Response.json({ errore: "E-mail o password non corrette." }, { status: 401 });
    }

    await creaSessione(utente._id.toString());
    return Response.json({ ruolo: utente.ruolo });
  } catch {
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

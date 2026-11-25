import { connectDB } from "@/db/connect";
import { autenticaUtente } from "@/db/models/Utente";
import { getAreaRuolo, PERCORSO_CAMBIA_PASSWORD } from "@/lib/aree";
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
    const utente = await autenticaUtente(email, password);
    if (!utente) {
      return Response.json({ errore: "E-mail o password non corrette." }, { status: 401 });
    }

    await creaSessione(utente._id.toString());
    // Con la password temporanea si va prima al cambio password (RF_UE_4).
    const area = utente.passwordTemporanea ? PERCORSO_CAMBIA_PASSWORD : getAreaRuolo(utente.ruolo);
    return Response.json({ ruolo: utente.ruolo, area });
  } catch {
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

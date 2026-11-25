import { NextResponse, type NextRequest } from "next/server";
import { getAreaDelPercorso, getAreaRuolo } from "@/lib/aree";
import { getUtenteDaToken, NOME_COOKIE } from "@/lib/sessione";

// Middleware di autenticazione (RF_UE_1, RNF_FUN_3): ogni richiesta, tranne
// quelle pubbliche, deve avere una sessione valida. Il controllo del ruolo
// sulle API resta nelle route, con richiediRuolo().
const PERCORSI_PUBBLICI = new Set(["/login", "/api/auth/login", "/api/auth/logout", "/api/health"]);

function vaiA(percorso: string, request: NextRequest) {
  return NextResponse.redirect(new URL(percorso, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const isPubblico = PERCORSI_PUBBLICI.has(pathname);

  let utente;
  try {
    utente = await getUtenteDaToken(request.cookies.get(NOME_COOKIE)?.value);
  } catch {
    if (isPubblico) return NextResponse.next();
    return isApi
      ? Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 })
      : vaiA("/login", request);
  }

  if (!utente) {
    if (isPubblico) return NextResponse.next();
    return isApi
      ? Response.json({ errore: "Accesso richiesto." }, { status: 401 })
      : vaiA("/login", request);
  }

  const areaUtente = getAreaRuolo(utente.ruolo);

  // "/" e "/login" portano un utente autenticato nella sua area.
  if (pathname === "/" || pathname === "/login") return vaiA(areaUtente, request);

  // Le aree degli altri ruoli non sono accessibili: si torna alla propria.
  const areaRichiesta = getAreaDelPercorso(pathname);
  if (areaRichiesta && areaRichiesta !== areaUtente) return vaiA(areaUtente, request);

  return NextResponse.next();
}

export const config = {
  // Esclusi i file statici di Next.js e la favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { setTimeout } from "node:timers/promises";
import { test } from "node:test";
import { promisify } from "node:util";
import mongoose from "mongoose";

const execFileAsync = promisify(execFile);

// Dati fittizi definiti nel seed condiviso (src/db/setup/seed/).
const ID_PAZIENTE_SEED = "665000000000000000000005";
const ID_PIANO_STIMOLAZIONE_SEED = "665000000000000000000101";
const EMAIL_ADMIN_SEED = "admin@mindcompanion.test";
const EMAIL_PAZIENTE_SEED = "paziente@mindcompanion.test";
const EMAIL_ALTRO_PAZIENTE_SEED = "paziente2@mindcompanion.test";
const PASSWORD_SEED = "mindcompanion";

function creaUriDatabaseIsolato(uriBase) {
  const url = new URL(uriBase);
  url.pathname = `/mindcompanion_test_rf_ad_3_${randomBytes(4).toString("hex")}`;
  return url.toString();
}

function estraiCookieSessione(response) {
  const cookies = response.headers.getSetCookie();
  const cookieSessione = cookies.find((valore) => valore.startsWith("sessione="));
  assert.ok(cookieSessione, "La risposta di login non contiene il cookie di sessione");
  return cookieSessione.split(";")[0];
}

async function attendiServerPronto(baseUrl, server) {
  const deadline = Date.now() + 30_000;
  let ultimoErrore;

  while (Date.now() < deadline) {
    assert.equal(server.exitCode, null, "Next.js si è arrestato prima di diventare pronto");
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      if (response.status === 200) return;
    } catch (errore) {
      ultimoErrore = errore;
    }
    await setTimeout(500);
  }

  throw new Error("Next.js non ha risposto su /api/health entro il timeout", { cause: ultimoErrore });
}

async function effettuaLogin(baseUrl, email) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: PASSWORD_SEED }),
    signal: AbortSignal.timeout(5_000),
  });
  assert.equal(response.status, 200, `Login fallito per ${email}`);
  return estraiCookieSessione(response);
}

// Regressione Issue #22 (RF_AD_3): l'eliminazione di un paziente non deve lasciare
// piani di stimolazione, sessioni di stimolazione, piani alimentari o sessioni di accesso orfani.
test(
  "DELETE /api/admin/users/:id rimuove il paziente e non lascia piani di stimolazione orfani (RF_AD_3)",
  { timeout: 60_000 },
  async (context) => {
    assert.ok(process.env.MONGODB_URI, "Imposta MONGODB_URI verso un database di test");

    const uriTest = creaUriDatabaseIsolato(process.env.MONGODB_URI);
    const envTest = { ...process.env, MONGODB_URI: uriTest };

    await execFileAsync(process.execPath, ["src/db/setup/applica.mjs", "--reset"], { env: envTest });

    const connessione = await mongoose.createConnection(uriTest, { serverSelectionTimeoutMS: 10_000 }).asPromise();
    context.after(async () => {
      try {
        await connessione.dropDatabase();
      } finally {
        await connessione.close();
      }
    });

    const db = connessione.db;
    const pazienteId = new mongoose.Types.ObjectId(ID_PAZIENTE_SEED);
    const pianoStimolazioneId = new mongoose.Types.ObjectId(ID_PIANO_STIMOLAZIONE_SEED);

    // Inserisce anche una sessione di stimolazione collegata al paziente per verificarne la pulizia.
    await db.collection("sessioniStimolazione").insertOne({
      paziente: pazienteId,
      piano: pianoStimolazioneId,
      data: new Date("2026-11-03T10:00:00Z"),
      stato: "COMPLETATA",
      livelloDifficolta: 2,
      esercizi: [
        {
          area: "MEMORIA",
          livelloDifficolta: 2,
          quesito: "Domanda fittizia di regressione",
          opzioniRisposta: ["A", "B"],
          rispostaCorretta: "A",
        },
      ],
    });

    const port = process.env.DELETE_TEST_PORT ?? "3911";
    const baseUrl = `http://127.0.0.1:${port}`;
    const server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port],
      { env: envTest, stdio: "inherit" },
    );
    const serverClosed = once(server, "close");
    context.after(async () => {
      server.kill();
      await serverClosed;
    });

    await attendiServerPronto(baseUrl, server);

    // Crea una sessione attiva per il paziente e autentica l'amministratore.
    await effettuaLogin(baseUrl, EMAIL_PAZIENTE_SEED);
    const cookieAdmin = await effettuaLogin(baseUrl, EMAIL_ADMIN_SEED);

    // Precondizioni: utente, piano di stimolazione, piano alimentare, sessioni presenti prima del DELETE.
    assert.equal(await db.collection("utenti").countDocuments({ _id: pazienteId }), 1);
    assert.equal(await db.collection("pianiStimolazione").countDocuments({ paziente: pazienteId }), 1);
    assert.equal(await db.collection("pianiAlimentari").countDocuments({ paziente: pazienteId }), 1);
    assert.equal(await db.collection("sessioniStimolazione").countDocuments({ paziente: pazienteId }), 1);
    assert.equal(await db.collection("sessioniAccesso").countDocuments({ utente: pazienteId }), 1);

    const rispostaDelete = await fetch(`${baseUrl}/api/admin/users/${ID_PAZIENTE_SEED}`, {
      method: "DELETE",
      headers: { Cookie: cookieAdmin },
      signal: AbortSignal.timeout(10_000),
    });

    assert.equal(rispostaDelete.status, 200);
    assert.equal(rispostaDelete.headers.get("cache-control"), "no-store");
    assert.deepEqual(await rispostaDelete.json(), { id: ID_PAZIENTE_SEED });

    // Il paziente eliminato non compare più nell'elenco utenti restituito all'amministratore.
    const rispostaElenco = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Cookie: cookieAdmin },
      signal: AbortSignal.timeout(10_000),
    });
    assert.equal(rispostaElenco.status, 200);
    const { utenti } = await rispostaElenco.json();
    assert.equal(
      utenti.some((utente) => utente.id === ID_PAZIENTE_SEED || utente.email === EMAIL_PAZIENTE_SEED),
      false,
      "Il paziente eliminato non deve comparire nell'elenco utenti",
    );

    // Nessun riferimento orfano in MongoDB, in particolare nessun piano di stimolazione per il paziente.
    assert.equal(await db.collection("utenti").countDocuments({ _id: pazienteId }), 0);
    assert.equal(
      await db.collection("pianiStimolazione").countDocuments({ paziente: pazienteId }),
      0,
      "Nessun piano di stimolazione deve puntare al paziente eliminato",
    );
    assert.equal(await db.collection("pianiAlimentari").countDocuments({ paziente: pazienteId }), 0);
    assert.equal(await db.collection("sessioniStimolazione").countDocuments({ paziente: pazienteId }), 0);
    assert.equal(await db.collection("sessioniAccesso").countDocuments({ utente: pazienteId }), 0);

    // Gli altri utenti del seed restano intatti.
    assert.equal(await db.collection("utenti").countDocuments({ email: EMAIL_ALTRO_PAZIENTE_SEED }), 1);
  },
);

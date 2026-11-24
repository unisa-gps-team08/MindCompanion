// Applica lo schema e il seed condivisi al database indicato da MONGODB_URI.
// Uso: node src/db/setup/applica.mjs [--reset]
//   senza opzioni: aggiorna validatori e indici, poi riporta i documenti del seed
//                  alla versione dei file (gli altri dati locali restano);
//   --reset:       cancella tutto il database prima di applicare schema e seed.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
import mongoose from "mongoose";

const { EJSON } = mongoose.mongo.BSON;
const CARTELLA = path.dirname(fileURLToPath(import.meta.url));

// Password fittizia di tutti gli utenti del seed, solo per lo sviluppo locale.
const PASSWORD_SEED = "mindcompanion";

// Stesso formato "salt:hash" di src/db/password.ts: se cambia lì, va cambiato anche qui.
function calcolaHashPassword(password) {
  const salt = randomBytes(16);
  const chiave = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${chiave.toString("hex")}`;
}

// Stesso formato e stessa chiave di src/db/crittografia.ts: lo script gira con Node
// fuori da Next.js e non può importare quel modulo. Se cambia lì, va cambiato anche qui.
function getChiave() {
  if (process.env.CHIAVE_CIFRATURA) return Buffer.from(process.env.CHIAVE_CIFRATURA, "base64");
  if (process.env.NODE_ENV === "production") throw new Error("CHIAVE_CIFRATURA mancante");
  return scryptSync("mindcompanion-solo-sviluppo", "mindcompanion", 32);
}

function cifra(testo) {
  const iv = randomBytes(12);
  const cifrario = createCipheriv("aes-256-gcm", getChiave(), iv);
  const cifrato = Buffer.concat([cifrario.update(testo, "utf8"), cifrario.final()]);
  return "enc:v1:" + Buffer.concat([iv, cifrario.getAuthTag(), cifrato]).toString("base64");
}

/** Cifra il campo indicato da un percorso come "pasti.alimenti", attraversando gli array. */
function cifraPercorso(oggetto, percorso) {
  if (oggetto == null) return;
  if (Array.isArray(oggetto)) {
    oggetto.forEach((elemento) => cifraPercorso(elemento, percorso));
    return;
  }
  const [campo, ...resto] = percorso.split(".");
  if (resto.length > 0) {
    cifraPercorso(oggetto[campo], resto.join("."));
  } else if (typeof oggetto[campo] === "string") {
    oggetto[campo] = cifra(oggetto[campo]);
  } else if (Array.isArray(oggetto[campo])) {
    oggetto[campo] = oggetto[campo].map(cifra);
  }
}

async function leggiFile(sottocartella) {
  const cartella = path.join(CARTELLA, sottocartella);
  const nomi = (await readdir(cartella)).filter((nome) => nome.endsWith(".json")).sort();
  return Promise.all(
    nomi.map(async (nome) => EJSON.parse(await readFile(path.join(cartella, nome), "utf8"))),
  );
}

/** Applica validatori e indici; restituisce i campi da cifrare di ogni collezione. */
async function applicaSchema(db) {
  const esistenti = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  const campiCifrati = new Map();

  for (const { collezione, validatore, indici = [], campiCifrati: campi = [] } of await leggiFile(
    "schema",
  )) {
    campiCifrati.set(collezione, campi);
    if (esistenti.has(collezione)) {
      await db.command({ collMod: collezione, validator: validatore });
    } else {
      await db.createCollection(collezione, { validator: validatore });
    }
    for (const { chiavi, opzioni = {} } of indici) {
      await db.collection(collezione).createIndex(chiavi, opzioni);
    }
    console.info(`schema: ${collezione}`);
  }
  return campiCifrati;
}

async function applicaSeed(db, campiCifrati) {
  for (const { collezione, documenti } of await leggiFile("seed")) {
    for (const documento of documenti) {
      if (collezione === "utenti" && !documento.passwordHash) {
        documento.passwordHash = calcolaHashPassword(PASSWORD_SEED);
      }
      for (const percorso of campiCifrati.get(collezione) ?? []) {
        cifraPercorso(documento, percorso);
      }
      await db
        .collection(collezione)
        .replaceOne({ _id: documento._id }, documento, { upsert: true });
    }
    console.info(`seed: ${collezione} (${documenti.length} documenti)`);
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI non impostata");
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  const db = mongoose.connection.db;

  if (process.argv.includes("--reset")) {
    await db.dropDatabase();
    console.info("database cancellato (--reset)");
  }
  const campiCifrati = await applicaSchema(db);
  await applicaSeed(db, campiCifrati);
  console.info("database pronto");
} catch (errore) {
  console.error("applicazione di schema e seed non riuscita:", errore.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

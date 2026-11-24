// Applica lo schema e il seed condivisi al database indicato da MONGODB_URI.
// Uso: node src/db/setup/applica.mjs [--reset]
//   senza opzioni: aggiorna validatori e indici, poi riporta i documenti del seed
//                  alla versione dei file (gli altri dati locali restano);
//   --reset:       cancella tutto il database prima di applicare schema e seed.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scryptSync } from "node:crypto";
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

async function leggiFile(sottocartella) {
  const cartella = path.join(CARTELLA, sottocartella);
  const nomi = (await readdir(cartella)).filter((nome) => nome.endsWith(".json")).sort();
  return Promise.all(
    nomi.map(async (nome) => EJSON.parse(await readFile(path.join(cartella, nome), "utf8"))),
  );
}

async function applicaSchema(db) {
  const esistenti = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );

  for (const { collezione, validatore, indici = [] } of await leggiFile("schema")) {
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
}

async function applicaSeed(db) {
  for (const { collezione, documenti } of await leggiFile("seed")) {
    for (const documento of documenti) {
      if (collezione === "utenti" && !documento.passwordHash) {
        documento.passwordHash = calcolaHashPassword(PASSWORD_SEED);
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
  await applicaSchema(db);
  await applicaSeed(db);
  console.info("database pronto");
} catch (errore) {
  console.error("applicazione di schema e seed non riuscita:", errore.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

"use client";

import { CircleCheck, CircleX, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Campo, SezioneForm } from "@/components/CampoForm";
import { IntestazioneUtente } from "@/components/IntestazioneUtente";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ErroriCampi } from "@/lib/validazioneNuovoUtente";

const VALORI_VUOTI = {
  nome: "",
  cognome: "",
  email: "",
  codiceFiscale: "",
  dataNascita: "",
  codiceMedico: "",
  specializzazione: "",
};

const MESSAGGIO_NON_RAGGIUNGIBILE = "Servizio non raggiungibile, controlla la connessione e riprova.";
// Passo e pressione del pulsante (Taste Skill, motion.md): su di 1 px al passaggio, giù di 1 px al clic.
const CLASSE_PULSANTE =
  "h-12 px-5 text-base transition-[transform,background-color,color] duration-150 hover:-translate-y-px active:translate-y-px active:scale-[.985] motion-reduce:transform-none";

type Valori = typeof VALORI_VUOTI;
type NomeCampo = keyof Valori;
type Esito = { tipo: "successo" | "errore"; messaggio: string } | null;
type RispostaApi = Partial<Record<NomeCampo | "ruolo" | "errore", string>> & { campi?: ErroriCampi };

async function leggiRisposta(risposta: Response): Promise<RispostaApi> {
  return (await risposta.json().catch(() => ({}))) as RispostaApi;
}

// Messaggio di conferma o di errore (SC_AD_2), con icona e colore: non si affida al solo colore.
function Avviso({ esito }: { esito: NonNullable<Esito> }) {
  const errore = esito.tipo === "errore";
  const Icona = errore ? CircleX : CircleCheck;
  return (
    <p
      role={errore ? "alert" : "status"}
      className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-base font-medium ${
        errore ? "border-red-200 bg-red-50 text-red-800" : "border-border bg-muted text-foreground"
      }`}
    >
      <Icona aria-hidden className="size-5 shrink-0" />
      {esito.messaggio}
    </p>
  );
}

// ModificaUtenteForm (RF_AD_2): gli stessi campi di InserisciUtente, precompilati con i dati attuali.
// Il ruolo è mostrato ma non si modifica; la password non si tocca: la cambia solo l'utente.
export function ModificaUtenteForm() {
  // Il form legge l'id dall'URL: così la pagina resta statica e i dati arrivano dall'API.
  const { id } = useParams<{ id: string }>();
  const [valori, setValori] = useState<Valori | null>(null);
  // Dati dell'intestazione: cambiano solo dopo un salvataggio riuscito, non mentre si scrive.
  const [salvati, setSalvati] = useState<Valori>(VALORI_VUOTI);
  const [ruolo, setRuolo] = useState("");
  const [errori, setErrori] = useState<ErroriCampi>({});
  const [esito, setEsito] = useState<Esito>(null);
  const [inCorso, setInCorso] = useState(false);

  useEffect(() => {
    async function caricaUtente() {
      try {
        const risposta = await fetch(`/api/admin/users/${id}`);
        const dati = await leggiRisposta(risposta);
        if (!risposta.ok) {
          setEsito({ tipo: "errore", messaggio: dati.errore ?? "Impossibile caricare l'utente." });
          return;
        }
        // L'input di tipo date accetta solo il formato AAAA-MM-GG.
        const caricati = { ...VALORI_VUOTI, ...dati, dataNascita: (dati.dataNascita ?? "").slice(0, 10) };
        setRuolo(dati.ruolo ?? "");
        setValori(caricati);
        setSalvati(caricati);
      } catch {
        setEsito({ tipo: "errore", messaggio: MESSAGGIO_NON_RAGGIUNGIBILE });
      }
    }
    void caricaUtente();
  }, [id]);

  function propsCampo(nome: NomeCampo) {
    return {
      nome,
      value: valori?.[nome] ?? "",
      errore: errori[nome],
      onChange: (e: { target: { value: string } }) =>
        setValori((precedenti) => (precedenti ? { ...precedenti, [nome]: e.target.value } : precedenti)),
    };
  }

  async function salva(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!valori) return;
    setEsito(null);
    setErrori({});
    setInCorso(true);

    try {
      const risposta = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valori),
      });
      const dati = await leggiRisposta(risposta);
      if (!risposta.ok) {
        setErrori(dati.campi ?? {});
        setEsito({ tipo: "errore", messaggio: dati.errore ?? "Modifica non riuscita." });
        return;
      }
      setSalvati(valori);
      setEsito({ tipo: "successo", messaggio: "Modifiche salvate." });
    } catch {
      setEsito({ tipo: "errore", messaggio: MESSAGGIO_NON_RAGGIUNGIBILE });
    } finally {
      setInCorso(false);
    }
  }

  if (!valori) {
    return esito ? (
      <Avviso esito={esito} />
    ) : (
      <p role="status" className="flex items-center gap-2 text-lg text-muted-foreground">
        <LoaderCircle aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
        Caricamento dei dati dell&apos;utente…
      </p>
    );
  }

  return (
    <form onSubmit={salva} className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b bg-muted/50 px-6 py-5">
        <IntestazioneUtente nome={salvati.nome} cognome={salvati.cognome} email={salvati.email} ruolo={ruolo} />
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        <SezioneForm titolo="Dati anagrafici">
          <Campo etichetta="Nome" required autoComplete="off" {...propsCampo("nome")} />
          <Campo etichetta="Cognome" required autoComplete="off" {...propsCampo("cognome")} />
          <Campo
            etichetta="Codice fiscale"
            required
            maxLength={16}
            pattern="[A-Za-z0-9]{16}"
            title="16 caratteri tra lettere e numeri"
            suggerimento="16 caratteri, lettere e numeri"
            autoComplete="off"
            className="font-mono tracking-wide uppercase"
            {...propsCampo("codiceFiscale")}
          />
          <Campo etichetta="Data di nascita" type="date" required {...propsCampo("dataNascita")} />
        </SezioneForm>

        <SezioneForm titolo="Accesso">
          <Campo
            etichetta="E-mail"
            type="email"
            required
            autoComplete="off"
            suggerimento="L'utente la usa per accedere"
            {...propsCampo("email")}
          />
          <p className="flex items-start gap-2 self-center text-base text-muted-foreground">
            <LockKeyhole aria-hidden className="mt-0.5 size-5 shrink-0" />
            La password non si modifica da qui: la cambia solo l&apos;utente, dalla pagina Cambia password.
          </p>
        </SezioneForm>

        {ruolo === "MEDICO" && (
          <SezioneForm titolo="Dati professionali">
            <Campo etichetta="Codice medico" required autoComplete="off" {...propsCampo("codiceMedico")} />
            <Campo etichetta="Specializzazione" required autoComplete="off" {...propsCampo("specializzazione")} />
          </SezioneForm>
        )}

        {esito && <Avviso esito={esito} />}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t bg-muted/50 px-6 py-4 sm:flex-row sm:justify-end">
        {/* Annulla torna all'elenco utenti (RF_AD_7), che è la pagina iniziale dell'amministratore. */}
        <Link href="/amministratore" className={cn(buttonVariants({ variant: "outline", className: CLASSE_PULSANTE }))}>
          Annulla
        </Link>
        <Button type="submit" disabled={inCorso} className={CLASSE_PULSANTE}>
          {inCorso && <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" />}
          {inCorso ? "Salvataggio in corso…" : "Salva Modifiche"}
        </Button>
      </div>
    </form>
  );
}

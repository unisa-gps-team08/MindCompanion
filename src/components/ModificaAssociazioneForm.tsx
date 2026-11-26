"use client";

import { useMemo, useState, type FormEvent } from "react";
import { RimuoviAssociazioneButton } from "@/components/RimuoviAssociazioneButton";
import { Button } from "@/components/ui/button";
import type {
  AssociazioniPazienteAttuali,
  FiguraDisponibile,
  RuoloFigura,
} from "@/lib/associazioniPaziente";

type ModificaAssociazioneFormProps = {
  associazioniAttuali: AssociazioniPazienteAttuali;
  utentiDisponibili: FiguraDisponibile[];
  ruoloIniziale?: RuoloFigura;
  onSuccess?: (datiAggiornati: AssociazioniPazienteAttuali) => void;
  onCancel?: () => void;
};

type Toast = { tipo: "success" | "error"; messaggio: string } | null;

const OPZIONI_RUOLO: { ruolo: RuoloFigura; etichetta: string }[] = [
  { ruolo: "MEDICO", etichetta: "Medico (0..1)" },
  { ruolo: "NUTRIZIONISTA", etichetta: "Nutrizionista (0..1)" },
  { ruolo: "TUTORE", etichetta: "Tutori (0..*)" },
];

// ModificaAssociazioneForm (RF_AD_10, nel RAD precedente RF_AD_12): l'amministratore sostituisce
// il medico o il nutrizionista del paziente, oppure modifica l'elenco dei tutori.
export function ModificaAssociazioneForm({
  associazioniAttuali,
  utentiDisponibili,
  ruoloIniziale = "MEDICO",
  onSuccess,
  onCancel,
}: ModificaAssociazioneFormProps) {
  const [ruoloSelezionato, setRuoloSelezionato] = useState<RuoloFigura>(ruoloIniziale);
  const [nuovoIdSingolo, setNuovoIdSingolo] = useState<string>(() =>
    idAttualeSingolo(associazioniAttuali, ruoloIniziale),
  );
  const [tutoriSelezionati, setTutoriSelezionati] = useState<string[]>(associazioniAttuali.tutoriIds);
  const [ricerca, setRicerca] = useState("");
  const [erroreValidazione, setErroreValidazione] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [inSalvataggio, setInSalvataggio] = useState(false);
  const nomePaziente = `${associazioniAttuali.cognomePaziente} ${associazioniAttuali.nomePaziente}`;

  function mostraToast(tipo: "success" | "error", messaggio: string) {
    setToast({ tipo, messaggio });
    setTimeout(() => setToast((corrente) => (corrente?.messaggio === messaggio ? null : corrente)), 4000);
  }

  const candidatiFiltrati = useMemo(() => {
    const query = ricerca.trim().toLowerCase();
    return utentiDisponibili.filter((utente) => {
      if (utente.ruolo !== ruoloSelezionato) return false;
      if (!query) return true;
      return `${utente.nome} ${utente.cognome} ${utente.codiceFiscale} ${utente.email}`.toLowerCase().includes(query);
    });
  }, [utentiDisponibili, ruoloSelezionato, ricerca]);

  function nomeFigura(id: string | null): string {
    const figura = utentiDisponibili.find((utente) => utente.id === id);
    return figura ? `${figura.cognome} ${figura.nome}` : "nessuno";
  }

  // Dopo una modifica o una rimozione le selezioni del form devono ripartire dai dati salvati,
  // altrimenti un tutore appena rimosso verrebbe riproposto al salvataggio successivo.
  function sincronizza(aggiornate: AssociazioniPazienteAttuali) {
    setTutoriSelezionati(aggiornate.tutoriIds);
    setNuovoIdSingolo(idAttualeSingolo(aggiornate, ruoloSelezionato));
    onSuccess?.(aggiornate);
  }

  function dopoRimozione(aggiornate: AssociazioniPazienteAttuali | null, messaggio: string) {
    mostraToast("success", messaggio);
    if (aggiornate) sincronizza(aggiornate);
  }

  function cambiaRuolo(nuovoRuolo: RuoloFigura) {
    setRuoloSelezionato(nuovoRuolo);
    setErroreValidazione(null);
    if (nuovoRuolo === "TUTORE") setTutoriSelezionati(associazioniAttuali.tutoriIds);
    else setNuovoIdSingolo(idAttualeSingolo(associazioniAttuali, nuovoRuolo));
  }

  function cambiaTutore(idTutore: string) {
    setErroreValidazione(null);
    setTutoriSelezionati((precedenti) =>
      precedenti.includes(idTutore) ? precedenti.filter((id) => id !== idTutore) : [...precedenti, idTutore],
    );
  }

  async function conferma(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroreValidazione(null);

    if (ruoloSelezionato !== "TUTORE" && !nuovoIdSingolo) {
      const messaggio = `Seleziona un ${ruoloSelezionato.toLowerCase()} per effettuare la sostituzione.`;
      setErroreValidazione(messaggio);
      mostraToast("error", messaggio);
      return;
    }

    setInSalvataggio(true);
    try {
      const corpo =
        ruoloSelezionato === "TUTORE"
          ? { ruoloFigura: ruoloSelezionato, tutoriIds: tutoriSelezionati }
          : { ruoloFigura: ruoloSelezionato, nuovoIdFigura: nuovoIdSingolo };

      const risposta = await fetch(`/api/admin/associations/${associazioniAttuali.pazienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const dati = (await risposta.json().catch(() => ({}))) as {
        errore?: string;
        messaggio?: string;
        associazioni?: AssociazioniPazienteAttuali;
      };

      if (!risposta.ok) {
        const messaggio = dati.errore ?? "Modifica non valida: le associazioni sono rimaste invariate.";
        setErroreValidazione(messaggio);
        mostraToast("error", messaggio);
        return;
      }

      mostraToast("success", dati.messaggio ?? "Associazione aggiornata con successo.");
      if (dati.associazioni) sincronizza(dati.associazioni);
    } catch {
      const messaggio = "Servizio non raggiungibile: le associazioni sono rimaste invariate.";
      setErroreValidazione(messaggio);
      mostraToast("error", messaggio);
    } finally {
      setInSalvataggio(false);
    }
  }

  return (
    <div className="relative space-y-5 rounded-lg border p-5">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 bottom-4 z-50 rounded-md border px-4 py-3 text-sm font-medium shadow-md ${
            toast.tipo === "success"
              ? "border-green-600 bg-green-50 text-green-900"
              : "border-red-600 bg-red-50 text-red-900"
          }`}
        >
          {toast.messaggio}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold">
          Modifica associazioni — {associazioniAttuali.cognomePaziente} {associazioniAttuali.nomePaziente}
        </h2>
        <p className="text-sm text-gray-600">Massimo 1 medico e 1 nutrizionista per paziente; 0 o più tutori.</p>
      </div>

      <ul className="space-y-2 text-sm">
        <li className="flex flex-wrap items-center gap-2">
          <span className="font-medium">Medico attuale:</span>
          <span>{nomeFigura(associazioniAttuali.medicoId)}</span>
          {associazioniAttuali.medicoId && (
            <RimuoviAssociazioneButton
              pazienteId={associazioniAttuali.pazienteId}
              nomePaziente={nomePaziente}
              ruoloFigura="MEDICO"
              nomeFigura={nomeFigura(associazioniAttuali.medicoId)}
              onRimossa={dopoRimozione}
            />
          )}
        </li>
        <li className="flex flex-wrap items-center gap-2">
          <span className="font-medium">Nutrizionista attuale:</span>
          <span>{nomeFigura(associazioniAttuali.nutrizionistaId)}</span>
          {associazioniAttuali.nutrizionistaId && (
            <RimuoviAssociazioneButton
              pazienteId={associazioniAttuali.pazienteId}
              nomePaziente={nomePaziente}
              ruoloFigura="NUTRIZIONISTA"
              nomeFigura={nomeFigura(associazioniAttuali.nutrizionistaId)}
              onRimossa={dopoRimozione}
            />
          )}
        </li>
        <li className="space-y-1">
          <span className="font-medium">Tutori attuali:</span>
          {associazioniAttuali.tutoriIds.length === 0 ? (
            <span> nessuno</span>
          ) : (
            <ul className="space-y-1 pl-4">
              {associazioniAttuali.tutoriIds.map((tutoreId) => (
                <li key={tutoreId} className="flex flex-wrap items-center gap-2">
                  <span>{nomeFigura(tutoreId)}</span>
                  <RimuoviAssociazioneButton
                    pazienteId={associazioniAttuali.pazienteId}
                    nomePaziente={nomePaziente}
                    ruoloFigura="TUTORE"
                    nomeFigura={nomeFigura(tutoreId)}
                    tutoreId={tutoreId}
                    onRimossa={dopoRimozione}
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      <form onSubmit={conferma} noValidate className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {OPZIONI_RUOLO.map((opzione) => (
            <button
              key={opzione.ruolo}
              type="button"
              onClick={() => cambiaRuolo(opzione.ruolo)}
              aria-pressed={ruoloSelezionato === opzione.ruolo}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                ruoloSelezionato === opzione.ruolo
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
            >
              {opzione.etichetta}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="ricerca-figura" className="block text-sm font-medium">
            Cerca per nome, cognome, codice fiscale o e-mail
          </label>
          <input
            id="ricerca-figura"
            type="text"
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            placeholder="Filtra utenti disponibili..."
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {ruoloSelezionato === "TUTORE" ? (
          <div className="space-y-2">
            <span className="block text-sm font-medium">Tutori associati al paziente</span>
            {candidatiFiltrati.length === 0 ? (
              <p className="text-sm text-gray-500">Nessun tutore disponibile con i criteri indicati.</p>
            ) : (
              <div className="divide-y rounded-md border">
                {candidatiFiltrati.map((tutore) => (
                  <label key={tutore.id} className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm">
                    <span>
                      <strong>
                        {tutore.cognome} {tutore.nome}
                      </strong>{" "}
                      ({tutore.codiceFiscale})
                    </span>
                    <input
                      type="checkbox"
                      checked={tutoriSelezionati.includes(tutore.id)}
                      onChange={() => cambiaTutore(tutore.id)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="selezione-figura-singola" className="block text-sm font-medium">
              Seleziona nuovo {ruoloSelezionato === "MEDICO" ? "medico" : "nutrizionista"}
            </label>
            <select
              id="selezione-figura-singola"
              value={nuovoIdSingolo}
              onChange={(e) => {
                setNuovoIdSingolo(e.target.value);
                setErroreValidazione(null);
              }}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">-- Seleziona --</option>
              {candidatiFiltrati.map((figura) => (
                <option key={figura.id} value={figura.id}>
                  {figura.cognome} {figura.nome} — {figura.codiceFiscale}
                </option>
              ))}
            </select>
          </div>
        )}

        {erroreValidazione && (
          <p role="alert" className="text-sm text-red-600">
            {erroreValidazione}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" disabled={inSalvataggio} onClick={onCancel}>
              Annulla
            </Button>
          )}
          <Button type="submit" disabled={inSalvataggio}>
            {inSalvataggio ? "Salvataggio..." : "Conferma modifica"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function idAttualeSingolo(associazioni: AssociazioniPazienteAttuali, ruolo: RuoloFigura): string {
  if (ruolo === "MEDICO") return associazioni.medicoId ?? "";
  if (ruolo === "NUTRIZIONISTA") return associazioni.nutrizionistaId ?? "";
  return "";
}

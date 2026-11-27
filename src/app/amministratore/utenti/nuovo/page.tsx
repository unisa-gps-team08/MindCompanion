import { InserisciUtenteForm } from "@/components/InserisciUtenteForm";
import { IntestazionePagina } from "@/components/IntestazionePagina";

// Pagina di InserisciUtente (RF_AD_1, SC_AD_1). L'accesso è riservato all'amministratore dal proxy.
export default function InserisciUtentePage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 py-2 sm:py-4">
      {/* print:hidden: in stampa resta solo il foglio delle credenziali (RF_AD_12). */}
      <IntestazionePagina
        className="print:hidden"
        titolo="Aggiungi nuovo utente"
        descrizione="Inserisci i dati anagrafici e il ruolo. La password temporanea la genera il sistema."
        indietro={{ href: "/amministratore", etichetta: "Torna all'area amministratore" }}
      />
      <InserisciUtenteForm />
    </section>
  );
}

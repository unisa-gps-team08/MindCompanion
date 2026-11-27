import { ElencoUtentiPage } from "@/components/ElencoUtentiPage";

// Pagina iniziale dell'area amministratore: VisualizzaElencoUtenti (RF_AD_7).
export default function AreaAmministratorePage() {
  return (
    <AreaProvvisoria titolo="Area amministratore">
      {/* Provvisorio: il pulsante andrà nella pagina Gestione Utenti (RF_AD_7, issue #20). */}
      <div>
        <Link href="/amministratore/utenti/nuovo" className={buttonVariants({ size: "lg" })}>
          Aggiungi Nuovo Utente
        </Link>
      </div>
      <div>
        <Link href="/amministratore/utenti/associazioni" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Gestisci associazioni utenti
        </Link>
      </div>
    </AreaProvvisoria>
  );
}

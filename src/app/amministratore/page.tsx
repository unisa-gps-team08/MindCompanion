import Link from "next/link";
import { AreaProvvisoria } from "@/components/AreaProvvisoria";
import { buttonVariants } from "@/components/ui/button";

export default function AreaAmministratorePage() {
  return (
    <AreaProvvisoria titolo="Area amministratore">
      {/* Provvisorio: il pulsante andrà nella pagina Gestione Utenti (RF_AD_7, issue #20). */}
      <div>
        <Link href="/amministratore/utenti/nuovo" className={buttonVariants({ size: "lg" })}>
          Aggiungi Nuovo Utente
        </Link>
      </div>
    </AreaProvvisoria>
  );
}

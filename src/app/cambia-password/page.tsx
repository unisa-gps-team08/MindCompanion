import { CambiaPasswordForm } from "@/components/CambiaPasswordForm";
import { LogoutButton } from "@/components/LogoutButton";
import { SchedaAccesso } from "@/components/SchedaAccesso";

// Pagina di CambiaPassword (RF_UE_3). Al primo accesso il proxy porta qui l'utente (RF_UE_4).
export default function CambiaPasswordPage() {
  return (
    <SchedaAccesso
      titolo="Cambia password"
      descrizione="Al primo accesso inserisci come password attuale quella ricevuta dall'amministratore."
    >
      <CambiaPasswordForm />
      <LogoutButton />
    </SchedaAccesso>
  );
}

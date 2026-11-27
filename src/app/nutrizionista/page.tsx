import { ElencoPazientiPage } from "@/components/ElencoPazientiPage";

// Pagina iniziale dell'area nutrizionista: VisualizzaElencoPazientiAssociati (RF_NT_6).
export default function AreaNutrizionistaPage() {
  return (
    <ElencoPazientiPage
      endpointApi="/api/nutritionist/patients"
      percorsoBaseScheda="/nutrizionista/pazienti"
    />
  );
}

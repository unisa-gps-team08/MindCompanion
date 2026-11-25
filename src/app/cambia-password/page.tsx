import { CambiaPasswordForm } from "@/components/CambiaPasswordForm";
import { LogoutButton } from "@/components/LogoutButton";

// Pagina di CambiaPassword (RF_UE_3). Al primo accesso il proxy porta qui l'utente (RF_UE_4).
export default function CambiaPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Cambia password</h1>
      <p className="text-lg">
        Al primo accesso inserisci come password attuale quella ricevuta dall&apos;amministratore.
      </p>
      <CambiaPasswordForm />
      <LogoutButton />
    </main>
  );
}

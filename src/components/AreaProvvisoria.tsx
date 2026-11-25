import type { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";

// Pagina provvisoria di arrivo per ruolo: la issue #19 la sostituisce con il layout e la sidebar.
export function AreaProvvisoria({ titolo, children }: { titolo: string; children?: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{titolo}</h1>
      {children ?? (
        <p className="text-lg">Accesso effettuato. Le funzioni di quest&apos;area arriveranno con i prossimi task.</p>
      )}
      <div>
        <LogoutButton />
      </div>
    </main>
  );
}

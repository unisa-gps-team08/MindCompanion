import { Suspense, type ReactNode } from "react";
import { LayoutAreaRiservata } from "@/components/LayoutAreaRiservata";

// Suspense: LayoutAreaRiservata legge il percorso con usePathname; nelle route con parametri
// (es. /amministratore/utenti/[id]/modifica) il percorso è noto solo a runtime.
export default function LayoutAmministratore({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutAreaRiservata>{children}</LayoutAreaRiservata>
    </Suspense>
  );
}

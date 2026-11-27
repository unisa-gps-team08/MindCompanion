"use client";

import { Suspense, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Avviso } from "@/components/Avviso";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { SidebarApplicazione } from "@/components/SidebarApplicazione";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isProfiloUtente, type ProfiloUtente } from "@/lib/navigazione";
import { cn } from "@/lib/utils";

type LayoutAreaRiservataProps = {
  children: ReactNode;
};

// Layout client delle aree riservate: ottiene il profilo da GET /api/auth/me senza accedere ai model.
export function LayoutAreaRiservata({ children }: LayoutAreaRiservataProps) {
  const router = useRouter();
  const [utente, setUtente] = useState<ProfiloUtente | null>(null);
  const [inCaricamento, setInCaricamento] = useState(true);
  const [errore, setErrore] = useState("");
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function caricaProfilo() {
      try {
        const risposta = await fetch("/api/auth/me", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (risposta.status === 401) {
          router.replace("/login");
          return;
        }

        const dati: unknown = await risposta.json().catch(() => null);
        if (!risposta.ok) {
          const messaggio =
            typeof dati === "object" &&
            dati !== null &&
            "errore" in dati &&
            typeof dati.errore === "string"
              ? dati.errore
              : "Impossibile caricare il profilo utente.";
          setErrore(messaggio);
          setInCaricamento(false);
          return;
        }

        if (!isProfiloUtente(dati)) {
          setErrore("Profilo utente non valido.");
          setInCaricamento(false);
          return;
        }

        setUtente(dati);
        setErrore("");
        setInCaricamento(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setErrore(
          "Servizio non raggiungibile, controlla la connessione e riprova.",
        );
        setInCaricamento(false);
      }
    }

    void caricaProfilo();
    return () => controller.abort();
  }, [router, tentativo]);

  function riprova() {
    setErrore("");
    setInCaricamento(true);
    setTentativo((precedente) => precedente + 1);
  }

  const modalitaPaziente = utente?.ruolo === "PAZIENTE";

  return (
    <TooltipProvider>
      {/* In stampa resta solo il contenuto della pagina, es. il foglio delle credenziali (RF_AD_12). */}
      <SidebarProvider
        style={
          {
            "--sidebar-width": modalitaPaziente ? "17.5rem" : "16.5rem",
          } as CSSProperties
        }
        className="print:[&_[data-slot=sidebar]]:hidden"
      >
        <SidebarApplicazione utente={utente} inCaricamento={inCaricamento} />
        <SidebarInset>
          <header
            className={cn(
              "sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b border-border/80 bg-card/90 px-4 backdrop-blur-xs print:hidden md:px-6",
              modalitaPaziente ? "h-18" : "h-16",
            )}
          >
            <SidebarTrigger
              className={cn(
                "-ml-1 rounded-lg text-foreground hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40",
                modalitaPaziente
                  ? "size-11 [&_svg]:size-5!"
                  : "size-9 [&_svg]:size-[1.125rem]!",
              )}
              aria-label="Apri o chiudi menu di navigazione"
            />
            <Separator
              orientation="vertical"
              className="mr-1 data-vertical:h-5 data-vertical:self-auto"
            />
            <Suspense fallback={<Skeleton className="h-5 w-44 rounded-md" />}>
              <BreadcrumbHeader
                utente={utente}
                modalitaPaziente={modalitaPaziente}
              />
            </Suspense>
          </header>

          <div
            className={cn(
              "flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8",
              modalitaPaziente && "text-lg text-foreground",
            )}
          >
            {errore && (
              <Avviso
                tipo="errore"
                className={cn("shadow-2xs", modalitaPaziente && "text-lg")}
                azione={
                  <Button
                    variant="outline"
                    size={modalitaPaziente ? "lg" : "sm"}
                    onClick={riprova}
                    className={cn(
                      "transition-transform duration-150 active:scale-[.985] motion-reduce:transform-none",
                      modalitaPaziente && "h-11 px-4 text-lg",
                    )}
                  >
                    Riprova
                  </Button>
                }
              >
                {errore}
              </Avviso>
            )}
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

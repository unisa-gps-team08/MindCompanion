"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarApplicazione } from "@/components/SidebarApplicazione";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  isProfiloUtente,
  ricavaBreadcrumb,
  type ProfiloUtente,
} from "@/lib/navigazione";
import { cn } from "@/lib/utils";

type LayoutAreaRiservataProps = {
  children: ReactNode;
};

// Layout client delle aree riservate: ottiene il profilo da GET /api/auth/me senza accedere ai model.
export function LayoutAreaRiservata({ children }: LayoutAreaRiservataProps) {
  const router = useRouter();
  const pathname = usePathname();
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
  const breadcrumb = utente ? ricavaBreadcrumb(utente.ruolo, pathname) : null;

  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarApplicazione utente={utente} inCaricamento={inCaricamento} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <SidebarTrigger
              className={cn("-ml-1", modalitaPaziente && "size-10")}
              aria-label="Apri o chiudi menu di navigazione"
            />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            {breadcrumb ? (
              <Breadcrumb>
                <BreadcrumbList
                  className={cn(
                    modalitaPaziente &&
                      "text-lg font-medium text-foreground",
                  )}
                >
                  {breadcrumb.pagina ? (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink
                          render={<Link href={breadcrumb.area.percorso} />}
                        >
                          {breadcrumb.area.titolo}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      {breadcrumb.sottoPagina && breadcrumb.pagina.percorso ? (
                        <>
                          <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink
                              render={
                                <Link href={breadcrumb.pagina.percorso} />
                              }
                            >
                              {breadcrumb.pagina.titolo}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator className="hidden md:block" />
                          <BreadcrumbItem>
                            <BreadcrumbPage>
                              {breadcrumb.sottoPagina}
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                        </>
                      ) : (
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            {breadcrumb.pagina.titolo}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      )}
                    </>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb.area.titolo}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              <Skeleton className="h-5 w-40" />
            )}
          </header>

          <div
            className={cn(
              "flex flex-1 flex-col gap-4 p-4 md:p-6",
              modalitaPaziente && "text-lg text-foreground",
            )}
          >
            {errore && (
              <div
                role="alert"
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800"
              >
                <span>{errore}</span>
                <Button variant="outline" size="sm" onClick={riprova}>
                  Riprova
                </Button>
              </div>
            )}
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

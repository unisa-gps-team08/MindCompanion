"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// LogoutButton (RF_UE_2).
export function LogoutButton() {
  const router = useRouter();

  async function esci() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <Button variant="outline" onClick={esci}>
      Esci
    </Button>
  );
}

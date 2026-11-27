import { redirect } from "next/navigation";

// Pagina iniziale: il proxy porta gli utenti autenticati nella loro area, gli altri arrivano qui.
export default function Home() {
  redirect("/login");
}

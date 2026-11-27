import type { Metadata } from "next";
import { Geist_Mono, Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Coppia di font per un'app sanitaria sobria e leggibile: serif per i titoli, sans per il
// testo. I token --font-heading e --font-sans di globals.css li leggono da qui.
const fontTitoli = Source_Serif_4({
  variable: "--font-titoli",
  subsets: ["latin"],
});

const fontTesto = Libre_Franklin({
  variable: "--font-testo",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindCompanion",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${fontTitoli.variable} ${fontTesto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

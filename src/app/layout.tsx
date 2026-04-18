import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AetherCast — Meteorología Avanzada",
  description:
    "La plataforma de meteorología más avanzada del mundo. Mapa interactivo, IA explicativa, multi-modelo y +80 capas profesionales.",
  keywords: ["meteorología", "tiempo", "pronóstico", "mapa", "clima", "weather"],
  authors: [{ name: "AetherCast" }],
  openGraph: {
    title: "AetherCast — Meteorología Avanzada",
    description: "Mapa interactivo inmersivo con +80 capas meteorológicas profesionales.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

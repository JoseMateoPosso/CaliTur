import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CaliTur — Sitios turísticos de Santiago de Cali",
  description:
    "Descubre los mejores sitios turísticos de Santiago de Cali. Cultura, naturaleza, gastronomía y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fff5f5] text-[#1c1917] flex flex-col min-h-screen`}
      >
        {/* ── NAVBAR GLOBAL ── */}
        <header className="bg-[#1c1917] sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl">🌴</span>
              <span className="text-[#f59e0b] font-bold text-lg tracking-wide group-hover:text-white transition-colors">
                CaliTur
              </span>
            </Link>

            {/* Navegación */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="text-white/70 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                Inicio
              </Link>
              <Link
                href="/login"
                className="ml-2 bg-[#c0392b] hover:bg-[#a93226] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Ingresar
              </Link>
            </nav>
          </div>
        </header>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main className="flex-grow">
          {children}
        </main>

        {/* ── FOOTER GLOBAL ── */}
        <footer className="bg-[#1c1917] text-white/40 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span>🌴</span>
                <span className="text-[#f59e0b] font-bold text-sm">CaliTur</span>
              </div>
              <p className="text-sm text-center">
                © {new Date().getFullYear()} CaliTur — Desarrollado con Next.js y NestJS.
              </p>
              <div className="flex gap-4 text-sm">
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
                <Link href="/spots" className="hover:text-white transition-colors">
                  Explorar
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
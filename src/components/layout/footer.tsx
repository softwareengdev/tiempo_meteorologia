import Link from 'next/link';
import { Cloud, Code2, X, Mail } from 'lucide-react';
import { SITE_NAME, MAJOR_CITIES } from '@/lib/seo';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1020]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Cloud className="h-7 w-7 text-sky-400" />
              <span className="text-xl font-bold tracking-tight">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/50">
              La plataforma de meteorología más avanzada del mundo. Pronóstico
              hiperlocal multi-modelo y radar global, sin anuncios.
            </p>
            <div className="mt-6 flex items-center gap-4 text-white/40">
              <a aria-label="GitHub" href="https://github.com/softwareengdev/tiempo_meteorologia" className="transition-colors hover:text-white">
                <Code2 className="h-5 w-5" />
              </a>
              <a aria-label="Twitter" href="https://twitter.com/aethercast" className="transition-colors hover:text-white">
                <X className="h-5 w-5" />
              </a>
              <a aria-label="Email" href="mailto:hola@aethercast.app" className="transition-colors hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <FooterCol title="Producto">
            <FooterLink href="/">Mapa interactivo</FooterLink>
            <FooterLink href="/dashboard">Panel personal</FooterLink>
            <FooterLink href="/pro">Modo Pro</FooterLink>
            <FooterLink href="/precios">Precios</FooterLink>
          </FooterCol>

          <FooterCol title="Ciudades populares">
            {MAJOR_CITIES.slice(0, 6).map((c) => (
              <FooterLink key={c.slug} href={`/location/${c.slug}`}>
                Tiempo en {c.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Empresa">
            <FooterLink href="/sobre">Sobre nosotros</FooterLink>
            <FooterLink href="/legal/privacidad">Privacidad</FooterLink>
            <FooterLink href="/legal/terminos">Términos</FooterLink>
            <FooterLink href="https://github.com/softwareengdev/tiempo_meteorologia">Código abierto</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/30 md:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Datos: Open-Meteo, ECMWF, NOAA. Hecho con ☁️ en España.</p>
          <p>v2.0 — Phase 2 Commercial · Desplegado en Cloudflare Pages</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-wider text-white/80 uppercase">{title}</h4>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/50 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}

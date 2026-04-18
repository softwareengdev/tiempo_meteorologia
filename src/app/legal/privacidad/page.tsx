import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'AetherCast respeta tu privacidad. No vendemos tus datos. Cumplimos RGPD.',
  alternates: { canonical: '/legal/privacidad' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#0b1020] text-white">
      <article className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-[var(--fs-h1)] font-bold tracking-tight">Privacidad</h1>
        <p className="mt-4 text-sm text-white/40">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        <div className="mt-10 space-y-6 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Datos que recopilamos</h2>
            <p className="mt-2">Solo guardamos tus preferencias (ubicaciones favoritas, modo oscuro, capas activas) en tu navegador. Nada se envía a nuestros servidores.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. Geolocalización</h2>
            <p className="mt-2">La geolocalización se usa exclusivamente en tu navegador para mostrarte el tiempo en tu zona. Nunca se almacena.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. Cookies</h2>
            <p className="mt-2">No usamos cookies de seguimiento. Solo localStorage para preferencias.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. APIs externas</h2>
            <p className="mt-2">Open-Meteo (datos meteorológicos) y CARTO (mapas base) reciben tus solicitudes desde tu navegador. Consulta sus respectivas políticas.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">5. Cumplimiento RGPD</h2>
            <p className="mt-2">Cumplimos el Reglamento General de Protección de Datos (UE) 2016/679. Para cualquier consulta: hola@aethercast.app</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}

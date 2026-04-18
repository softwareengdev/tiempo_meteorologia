import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos de uso de AetherCast. Servicio gratuito, datos abiertos, licencia MIT.',
  alternates: { canonical: '/legal/terminos' },
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#0b1020] text-white">
      <article className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-[var(--fs-h1)] font-bold tracking-tight">Términos</h1>
        <p className="mt-4 text-sm text-white/40">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        <div className="mt-10 space-y-6 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Aceptación</h2>
            <p className="mt-2">Al usar AetherCast aceptas estos términos. Si no estás de acuerdo, no uses el servicio.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. Servicio</h2>
            <p className="mt-2">AetherCast es un servicio gratuito de información meteorológica basado en modelos numéricos abiertos. No garantizamos precisión absoluta — la meteorología es probabilística.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. Limitación de responsabilidad</h2>
            <p className="mt-2">No nos hacemos responsables de decisiones tomadas en base a la información mostrada. Para fines críticos (aviación, marina) consulta servicios oficiales.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. Licencia</h2>
            <p className="mt-2">El código fuente se distribuye bajo licencia MIT. Los datos meteorológicos pertenecen a sus respectivos proveedores.</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}

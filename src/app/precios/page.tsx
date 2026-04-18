import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Precios — Plan Free, Pro y Enterprise',
  description: 'Empieza gratis con AetherCast. Plan Pro desde 4,99€/mes con modelos premium, alertas push y API. Plan Enterprise para empresas.',
  alternates: { canonical: '/precios' },
};

const PLANS = [
  {
    name: 'Free',
    price: '0',
    desc: 'Para todo el mundo. Para siempre.',
    features: ['Mapa con 30+ capas', 'Pronóstico 7 días', 'Multi-modelo básico (3)', 'IA básica (10/día)', 'PWA offline', 'Sin anuncios'],
    cta: 'Empezar gratis',
    href: '/',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '4,99',
    desc: 'Para profesionales y entusiastas.',
    features: ['Todo de Free +', '+80 capas profesionales', 'Pronóstico 16 días', 'Todos los modelos (8)', 'IA ilimitada', 'Alertas push personalizadas', 'Histórico ilimitado', 'Comparativa multi-modelo'],
    cta: 'Probar 14 días gratis',
    href: '#',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Para empresas y administraciones.',
    features: ['Todo de Pro +', 'API REST + WebSocket', 'SLA 99.99%', 'White-label', 'Soporte dedicado', 'Modelos privados', 'Datos hiperlocales (HRRR 1km)'],
    cta: 'Contactar ventas',
    href: 'mailto:hola@aethercast.app',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-[#0b1020] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
            <Sparkles className="h-3 w-3" /> Precios honestos
          </span>
          <h1 className="mt-4 text-[var(--fs-h1)] font-bold tracking-tight">
            Empieza gratis. Crece con nosotros.
          </h1>
          <p className="mt-4 text-lg text-white/55">
            Sin trampas, sin anuncios, sin venta de datos. Cancela cuando quieras.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.highlight
                  ? 'border-sky-400/40 bg-gradient-to-b from-sky-500/10 to-purple-500/5 shadow-glow'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400 to-purple-400 px-3 py-1 text-xs font-bold text-[#0b1020]">
                  RECOMENDADO
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-white/50">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                {plan.price === 'Custom' ? (
                  <span className="text-4xl font-bold">A medida</span>
                ) : (
                  <>
                    <span className="text-5xl font-bold tracking-tight">{plan.price}€</span>
                    <span className="text-white/40">/mes</span>
                  </>
                )}
              </div>

              <Link
                href={plan.href}
                className={`mt-6 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-white text-[#0b1020] hover:scale-[1.02]'
                    : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-white/75">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-xs text-white/40">
          Todos los planes incluyen acceso completo a datos abiertos (Open-Meteo, NOAA, ECMWF).
          IVA no incluido. Pago anual con descuento del 20%.
        </p>
      </div>
      <Footer />
    </div>
  );
}

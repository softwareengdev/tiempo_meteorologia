import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sin conexión',
  robots: { index: false, follow: false },
  alternates: { canonical: '/offline' },
};

export default function OfflinePage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-[#0b1020] text-white">
      <div className="mx-auto max-w-md px-6 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/[0.04] text-3xl">
          📡
        </div>
        <h1 className="mb-3 text-2xl font-bold">Sin conexión</h1>
        <p className="mb-6 text-sm text-white/60">
          Parece que estás offline. AetherCast guarda en caché los últimos pronósticos y mapas
          consultados. Vuelve a una vista que ya hayas visitado o reintenta cuando recuperes la red.
        </p>
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Volver a la portada
        </Link>
      </div>
    </div>
  );
}

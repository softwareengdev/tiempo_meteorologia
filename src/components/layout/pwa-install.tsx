'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!evt || hidden) return null;

  return (
    <div className="fixed left-4 right-4 bottom-20 z-40 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-sky-400/30 bg-[#0b1020]/95 p-3 shadow-2xl backdrop-blur-md md:left-4 md:right-auto md:bottom-6 md:max-w-xs">
      <Download className="h-5 w-5 shrink-0 text-sky-400" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-white">Instalar AetherCast</p>
        <p className="text-white/60 text-xs">Acceso rápido + funciona offline</p>
      </div>
      <button
        onClick={async () => { await evt.prompt(); setEvt(null); }}
        className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400"
      >
        Instalar
      </button>
      <button
        onClick={() => setHidden(true)}
        aria-label="Ocultar"
        className="text-white/40 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

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
    <div
      className="fixed left-3 z-40 flex items-center gap-2 rounded-full border border-sky-400/30 bg-[#0b1020]/92 py-1.5 pl-2.5 pr-1.5 text-xs shadow-lg backdrop-blur-md md:left-4 md:right-auto md:bottom-6"
      style={{ bottom: 'calc(var(--bottom-nav-h, 0px) + 0.75rem)' }}
      role="region"
      aria-label="Instalar aplicación"
    >
      <Download className="h-3.5 w-3.5 shrink-0 text-sky-400" />
      <span className="font-medium text-white/90">Instalar app</span>
      <button
        onClick={async () => { await evt.prompt(); setEvt(null); }}
        className="rounded-full bg-sky-500 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-sky-400"
      >
        Añadir
      </button>
      <button
        onClick={() => setHidden(true)}
        aria-label="Ocultar"
        className="rounded-full p-0.5 text-white/40 hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'aether:install-dismissed';

export function PWAInstall() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosShow, setIosShow] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [installed, setInstalled] = useState(false);
  const aiChatOpen = useWeatherStore((s) => s.aiChatOpen);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    if (sessionStorage.getItem(DISMISS_KEY) === '1') setHidden(true);

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) { setInstalled(true); return; }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // iOS Safari has no beforeinstallprompt; show a hint instead.
    const ua = navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos) setIosShow(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || hidden || aiChatOpen) return null;
  if (!evt && !iosShow) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setHidden(true);
  };

  const install = async () => {
    if (!evt) return;
    try {
      await evt.prompt();
      const choice = await evt.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
    } finally {
      setEvt(null);
    }
  };

  return (
    <div
      className="pointer-events-auto fixed left-3 z-40 flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-[#0b1020]/85 py-1 pl-2 pr-1 text-[11px] shadow-md backdrop-blur-md md:left-4 md:bottom-6"
      style={{ bottom: 'calc(var(--bottom-nav-h, 0px) + 0.5rem)' }}
      role="region"
      aria-label="Instalar aplicación"
    >
      <Download className="h-3 w-3 shrink-0 text-sky-400" />
      <span className="font-medium text-white/90">Instalar</span>
      {evt && (
        <button
          onClick={install}
          className="rounded-full bg-sky-500 px-2 py-0.5 text-[10.5px] font-semibold text-white hover:bg-sky-400"
        >
          Añadir
        </button>
      )}
      {!evt && iosShow && (
        <span className="text-[10px] text-white/70 max-w-[150px] leading-tight">
          Compartir → Añadir a inicio
        </span>
      )}
      <button
        onClick={dismiss}
        aria-label="Ocultar"
        className="rounded-full p-0.5 text-white/45 hover:bg-white/10 hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

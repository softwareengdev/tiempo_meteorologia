'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, LayoutDashboard, Activity, Sparkles, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWeatherStore } from '@/lib/stores';

const ITEMS = [
  { href: '/', icon: Map, label: 'Mapa' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
  { href: '/pro', icon: Activity, label: 'Pro' },
  { href: '/landing', icon: Sparkles, label: 'Más' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const toggleSidebar = useWeatherStore((s) => s.toggleSidebar);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/10 bg-[#0b1020]/90 px-2 pt-2 pb-safe backdrop-blur-xl md:hidden"
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[10px] transition-colors',
              active ? 'text-sky-400' : 'text-white/50 active:text-white',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={toggleSidebar}
        className="flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[10px] text-white/50 transition-colors active:text-white"
        aria-label="Buscar y filtros"
      >
        <Search className="h-5 w-5" strokeWidth={1.8} />
        <span className="font-medium">Capas</span>
      </button>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Map, LayoutDashboard, Activity, Sparkles, Search,
} from 'lucide-react';
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
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 items-stretch border-t border-white/10 bg-[#0b1020]/85 px-1 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.25rem)', paddingTop: '0.25rem' }}
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
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
            className={cn(
              'relative flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] transition-colors',
              active ? 'text-sky-300' : 'text-white/55 active:text-white',
            )}
          >
            {active && (
              <motion.span
                layoutId="bottomnav-active"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-x-2 top-1 -z-10 h-1 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
              />
            )}
            <motion.span
              animate={active ? { y: -1, scale: 1.06 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="flex items-center justify-center"
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
            </motion.span>
            <span className="font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={toggleSidebar}
        className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] text-white/55 transition-colors active:text-white"
        aria-label="Buscar y filtros de capas"
      >
        <Search className="h-5 w-5" strokeWidth={1.8} />
        <span className="font-medium leading-none">Capas</span>
      </button>
    </nav>
  );
}

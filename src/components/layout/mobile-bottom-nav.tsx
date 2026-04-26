'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Map, LayoutDashboard, Activity, Sparkles, GitCompare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/lib/hooks';

const ITEMS = [
  { href: '/', icon: Map, label: 'Mapa' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
  { href: '/comparador', icon: GitCompare, label: 'Comparar' },
  { href: '/pro', icon: Activity, label: 'Pro' },
  { href: '/landing', icon: Sparkles, label: 'Más' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const haptic = useHaptic();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-white/10 bg-[#0b1020]/90 px-1 backdrop-blur-xl md:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.25rem)',
        paddingTop: '0.25rem',
        // Hard, explicit grid via inline styles to dodge any Tailwind layer-ordering / cache issues.
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        // Expose nav height as a CSS var so other fixed elements (FABs, map controls) can offset themselves.
        ['--bottom-nav-h' as never]: 'calc(56px + env(safe-area-inset-bottom))',
      }}
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href === '/landing' && pathname === '/landing');
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
            prefetch={false}
            onClick={() => { if (!active) haptic('select'); }}
            className={cn(
              'relative flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10.5px] transition-colors',
              active ? 'text-sky-300' : 'text-white/55 active:text-white',
            )}
          >
            {active && (
              <motion.span
                layoutId="bottomnav-active"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-x-3 top-1 -z-10 h-1 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
              />
            )}
            <motion.span
              animate={active ? { y: -1, scale: 1.08 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="flex items-center justify-center"
            >
              <Icon className="h-[20px] w-[20px]" strokeWidth={active ? 2.4 : 1.8} />
            </motion.span>
            <span className="font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

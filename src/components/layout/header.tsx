'use client';

import { Cloud, Menu, X, LayoutDashboard, Map, Activity, Star, GitCompare, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LocationSearch } from './location-search';
import { ThemeToggle } from './theme-toggle';
import { OutdoorMode } from './outdoor-mode';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { href: '/', icon: Map, label: 'Mapa', accent: false },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', accent: false },
  { href: '/comparador', icon: GitCompare, label: 'Comparar', accent: false },
  { href: '/pro', icon: Activity, label: 'Pro', accent: true },
] as const;

const MORE_NAV = [
  { href: '/ciudades', label: 'Ciudades' },
  { href: '/alerts', label: 'Alertas' },
  { href: '/climate', label: 'Clima histórico' },
  { href: '/landing', label: 'Tour de producto' },
  { href: '/precios', label: 'Precios' },
  { href: '/sobre', label: 'Sobre AetherCast' },
] as const;

export function Header() {
  const {
    sidebarOpen, toggleSidebar, locationName,
    selectedLocation, favorites, addFavorite, removeFavorite,
  } = useWeatherStore();
  const pathname = usePathname();
  const isFav = favorites.some((f) => f.name === locationName);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Routes where the sidebar (map layers) is meaningful.
  const SIDEBAR_ROUTES = ['/'];
  const showSidebarToggle = SIDEBAR_ROUTES.includes(pathname);

  const toggleFav = () => {
    if (!selectedLocation) return;
    if (isFav) removeFavorite(locationName);
    else addFavorite(locationName, selectedLocation);
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center gap-1 border-b border-white/5 bg-gray-950/80 px-2 supports-[backdrop-filter]:bg-gray-950/65 backdrop-blur-xl sm:gap-2 sm:px-4"
      style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(3.5rem + env(safe-area-inset-top))' }}
    >
      {/* Group A: hamburger (only on map routes) + brand */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {showSidebarToggle && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleSidebar}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={sidebarOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        )}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="AetherCast inicio" prefetch={false}>
          <Cloud className="h-6 w-6 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
          <span className="hidden bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-base font-bold text-transparent sm:inline sm:text-lg">
            AetherCast
          </span>
        </Link>
      </div>

      {/* Group B: desktop primary nav */}
      <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Navegación principal">
        {PRIMARY_NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              prefetch={false}
              className={cn(
                'relative flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? item.accent
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/10 text-white'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/90',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
              {active && (
                <motion.span
                  layoutId="header-active-pill"
                  className={cn(
                    'absolute inset-0 -z-10 rounded-lg',
                    item.accent ? 'bg-purple-500/15' : 'bg-white/[0.06]',
                  )}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          );
        })}

        {/* More dropdown — desktop only */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            className={cn(
              'flex min-h-[40px] items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors',
              moreOpen ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white/90',
            )}
          >
            Más <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', moreOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                role="menu"
                className="absolute top-full right-0 mt-1 w-56 overflow-hidden rounded-xl border border-white/10 bg-gray-950/95 p-1 shadow-2xl backdrop-blur-xl"
              >
                {MORE_NAV.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    prefetch={false}
                    onClick={() => setMoreOpen(false)}
                    role="menuitem"
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      pathname === it.href ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {it.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Spacer pushes group C to the right */}
      <div className="flex-1" />

      {/* Group C: search + actions */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <LocationSearch />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleFav}
          aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={cn(
            'hidden h-10 w-10 items-center justify-center rounded-lg transition-colors sm:flex',
            isFav ? 'text-amber-400 hover:bg-amber-400/10' : 'text-white/50 hover:bg-white/10 hover:text-white',
          )}
        >
          <Star className={cn('h-4 w-4 transition-transform', isFav && 'fill-current scale-110')} />
        </motion.button>
        <div className="hidden sm:flex"><OutdoorMode /></div>
        <div className="hidden sm:flex"><ThemeToggle /></div>
      </div>
    </header>
  );
}

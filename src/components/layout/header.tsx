'use client';

import { Cloud, Menu, X, LayoutDashboard, Map, Activity, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LocationSearch } from './location-search';
import { ThemeToggle } from './theme-toggle';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

export function Header() {
  const {
    sidebarOpen, toggleSidebar, locationName,
    selectedLocation, favorites, addFavorite, removeFavorite,
  } = useWeatherStore();
  const pathname = usePathname();
  const isFav = favorites.some((f) => f.name === locationName);

  const toggleFav = () => {
    if (!selectedLocation) return;
    if (isFav) removeFavorite(locationName);
    else addFavorite(locationName, selectedLocation);
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-white/5 bg-gray-950/75 px-3 supports-[backdrop-filter]:bg-gray-950/60 backdrop-blur-xl sm:px-4"
      style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(3.5rem + env(safe-area-inset-top))' }}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={sidebarOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="AetherCast inicio">
          <Cloud className="h-6 w-6 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
          <h1 className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-base font-bold text-transparent sm:text-lg">
            AetherCast
          </h1>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {[
            { href: '/', icon: Map, label: 'Mapa', accent: false },
            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', accent: false },
            { href: '/pro', icon: Activity, label: 'Pro', accent: true },
          ].map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
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
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LocationSearch />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleFav}
          aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            isFav ? 'text-amber-400 hover:bg-amber-400/10' : 'text-white/50 hover:bg-white/10 hover:text-white',
          )}
        >
          <Star className={cn('h-4 w-4 transition-transform', isFav && 'fill-current scale-110')} />
        </motion.button>
        <ThemeToggle />
        <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 lg:flex">
          <span className="text-[11px] leading-none">📍</span>
          <span className="max-w-[10rem] truncate text-xs text-white/70">
            {locationName}
          </span>
        </div>
      </div>
    </header>
  );
}

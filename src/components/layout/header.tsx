'use client';

import { Cloud, Menu, X, LayoutDashboard, Map } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocationSearch } from './location-search';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

export function Header() {
  const { sidebarOpen, toggleSidebar, locationName } = useWeatherStore();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-gray-950/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={sidebarOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-sky-400" />
          <h1 className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-lg font-bold text-transparent">
            AetherCast
          </h1>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
              pathname === '/' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80',
            )}
          >
            <Map className="h-3.5 w-3.5" />
            Mapa
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
              pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80',
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <LocationSearch />
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs text-white/40">📍</span>
          <span className="max-w-48 truncate text-xs text-white/60">
            {locationName}
          </span>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { id: 'dark', icon: Moon, label: 'Oscuro' },
    { id: 'light', icon: Sun, label: 'Claro' },
    { id: 'system', icon: Monitor, label: 'Sistema' },
  ] as const;

  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`rounded-lg p-1.5 transition-colors ${
            theme === id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
          }`}
          aria-label={label}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

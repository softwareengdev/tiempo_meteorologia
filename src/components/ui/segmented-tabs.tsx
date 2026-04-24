'use client';

import { motion } from 'framer-motion';
import { useHaptic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface SegmentedTab<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedTabsProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  tabs: ReadonlyArray<SegmentedTab<T>>;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedTabs<T extends string>({
  value, onChange, tabs, className, ariaLabel,
}: SegmentedTabsProps<T>) {
  const haptic = useHaptic();
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'relative flex items-stretch gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur',
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${t.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => {
              if (!active) {
                haptic('select');
                onChange(t.value);
              }
            }}
            className={cn(
              'relative flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-colors',
              active ? 'text-white' : 'text-white/55 hover:text-white/85',
            )}
          >
            {active && (
              <motion.span
                layoutId={`segtabs-${ariaLabel ?? 'default'}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-blue-600/20 ring-1 ring-inset ring-sky-300/30"
              />
            )}
            {t.icon}
            <span className="leading-none">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

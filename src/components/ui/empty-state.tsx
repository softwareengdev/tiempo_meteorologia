'use client';

/**
 * EmptyState — Estado vacío ilustrado y reutilizable.
 * Usado en favoritos vacíos, búsqueda sin resultados, datos no disponibles.
 */

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center', className)}
      role="status"
    >
      <div className="rounded-2xl bg-gradient-to-br from-sky-400/15 to-blue-600/10 p-4 ring-1 ring-white/10">
        <Icon className="h-8 w-8 text-sky-300" strokeWidth={1.6} aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-white">{title}</p>
        {description && <p className="text-sm text-white/55">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </motion.div>
  );
}

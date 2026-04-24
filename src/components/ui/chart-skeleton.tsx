/**
 * Lightweight skeleton for chart widgets while the recharts chunk loads.
 * Pure CSS shimmer — no JS, ~0 bytes runtime.
 */
export function ChartSkeleton({ height = 220, label }: { height?: number; label?: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4"
      style={{ contentVisibility: 'auto', containIntrinsicSize: `${height + 80}px` }}
      aria-busy="true"
      aria-label={label ?? 'Cargando gráfico'}
    >
      <div className="mb-3 h-4 w-32 rounded bg-white/10" />
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] [background-size:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

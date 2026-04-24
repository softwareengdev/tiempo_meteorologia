'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true once the component has mounted on the client AND a layout
 * pass has occurred. Used to defer rendering of layout-measuring children
 * (e.g. Recharts ResponsiveContainer) until the parent has real dimensions,
 * avoiding the "width(-1) and height(-1)" warning during initial paint.
 *
 * The setState-in-effect is intentional here: we need the render boundary
 * to occur AFTER the browser has measured layout. useSyncExternalStore
 * does not provide that guarantee.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}

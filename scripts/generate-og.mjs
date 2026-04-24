/**
 * Generates public/og.png (1200x630) — the global Open Graph card.
 * Run with: node scripts/generate-og.mjs
 *
 * Uses sharp (already a transitive dependency) to rasterize an inline SVG.
 * Re-run this if branding changes.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'og.png');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1020"/>
      <stop offset="50%" stop-color="#1a1f4a"/>
      <stop offset="100%" stop-color="#0b1020"/>
    </linearGradient>
    <radialGradient id="aurora" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="aurora2" cx="80%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#aurora)"/>
  <rect width="1200" height="630" fill="url(#aurora2)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <g transform="translate(80, 80)">
    <circle cx="28" cy="28" r="28" fill="#38bdf8"/>
    <circle cx="28" cy="28" r="16" fill="#0b1020"/>
    <text x="80" y="38" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="32" font-weight="800" fill="#ffffff">AetherCast</text>
  </g>

  <text x="80" y="320" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="72" font-weight="800" fill="#ffffff">El tiempo más preciso</text>
  <text x="80" y="400" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="72" font-weight="800" fill="#38bdf8">del planeta</text>

  <text x="80" y="460" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="26" font-weight="400" fill="#ffffffaa">Multi-modelo · IA explicativa · Sin anuncios</text>

  <g transform="translate(80, 510)" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="20" font-weight="600">
    <g><rect width="110" height="44" rx="22" fill="#ffffff14" stroke="#ffffff22"/><text x="55" y="29" fill="#ffffff" text-anchor="middle">ECMWF</text></g>
    <g transform="translate(125, 0)"><rect width="90" height="44" rx="22" fill="#ffffff14" stroke="#ffffff22"/><text x="45" y="29" fill="#ffffff" text-anchor="middle">ICON</text></g>
    <g transform="translate(225, 0)"><rect width="80" height="44" rx="22" fill="#ffffff14" stroke="#ffffff22"/><text x="40" y="29" fill="#ffffff" text-anchor="middle">GFS</text></g>
    <g transform="translate(315, 0)"><rect width="95" height="44" rx="22" fill="#ffffff14" stroke="#ffffff22"/><text x="47" y="29" fill="#ffffff" text-anchor="middle">HRRR</text></g>
    <g transform="translate(420, 0)"><rect width="80" height="44" rx="22" fill="#ffffff14" stroke="#ffffff22"/><text x="40" y="29" fill="#ffffff" text-anchor="middle">GEM</text></g>
  </g>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, png);
console.log(`Generated ${out} (${png.length} bytes)`);

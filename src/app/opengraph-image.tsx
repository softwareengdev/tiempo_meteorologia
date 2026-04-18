import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/seo';

export const runtime = 'edge';
export const alt = 'AetherCast — el tiempo más preciso del planeta';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0b1020 0%, #142053 50%, #1a3389 100%)',
          color: 'white',
          padding: 80,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #38bdf8, #2f72ff, #6b5cff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
            }}
          >
            ☁
          </div>
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>{SITE_NAME}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', gap: 24 }}>
          <h1 style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3, margin: 0 }}>
            El tiempo más
            <br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #6b5cff, #ff5fb0)', backgroundClip: 'text', color: 'transparent' }}>
              preciso del planeta
            </span>
          </h1>
          <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 900 }}>
            Multi-modelo · Mapa interactivo · IA explicativa · Sin anuncios
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40, right: 80,
            display: 'flex', gap: 20, alignItems: 'center',
            color: 'rgba(255,255,255,0.5)', fontSize: 20,
          }}
        >
          <span>ECMWF</span><span>·</span><span>ICON</span><span>·</span><span>GFS</span><span>·</span><span>HRRR</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

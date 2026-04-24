import type { Metadata, Viewport } from 'next';
import { Inter, Manrope, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { WebVitalsReporter } from '@/components/analytics/web-vitals';
import { CloudflareAnalytics } from '@/components/analytics/cloudflare';
import { JsonLd, organizationJsonLd, websiteJsonLd, webApplicationJsonLd, SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/seo';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const manrope = Manrope({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — El tiempo más preciso del planeta`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Weather',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
      'es-MX': '/',
      'es-AR': '/',
      'es-CO': '/',
      'es-CL': '/',
      'es-419': '/',
      'x-default': '/',
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US', 'pt_BR'],
    url: SITE_URL,
    title: `${SITE_NAME} — Meteorología profesional, sin anuncios`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} — el tiempo más preciso del planeta`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — El tiempo más preciso del planeta`,
    description: SITE_DESCRIPTION,
    site: '@aethercast',
    creator: '@aethercast',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/icon.svg' }],
    shortcut: '/icons/icon.svg',
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="preconnect" href="https://geocoding-api.open-meteo.com" />
        <link rel="preconnect" href="https://air-quality-api.open-meteo.com" />
        <link rel="preconnect" href="https://marine-api.open-meteo.com" />
        <link rel="preconnect" href="https://basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://tilecache.rainviewer.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://api.rainviewer.com" />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={webApplicationJsonLd} />
      </head>
      <body className="flex min-h-dvh flex-col bg-[#0b1020] text-white">
        <Providers>{children}</Providers>
        <WebVitalsReporter />
        <CloudflareAnalytics />
      </body>
    </html>
  );
}

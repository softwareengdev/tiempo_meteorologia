import { Metadata } from 'next';
import { getForecast, searchLocations, getWeatherDescription, getWeatherIcon } from '@/lib/weather';

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { slug: 'madrid' },
    { slug: 'barcelona' },
    { slug: 'valencia' },
    { slug: 'sevilla' },
    { slug: 'zaragoza' },
    { slug: 'malaga' },
    { slug: 'bilbao' },
    { slug: 'palma' },
    { slug: 'las-palmas' },
    { slug: 'murcia' },
  ];
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = decodeURIComponent(slug).replace(/-/g, ' ');
  return {
    title: `Tiempo en ${name} — AetherCast`,
    description: `Pronóstico meteorológico detallado para ${name}. Temperatura, viento, precipitación y más.`,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const name = decodeURIComponent(slug).replace(/-/g, ' ');

  const locations = await searchLocations(name);
  if (!locations.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Ubicación no encontrada</h1>
          <p className="mt-2 text-white/60">No se encontraron resultados para &quot;{name}&quot;</p>
          <a href="/" className="mt-4 inline-block text-sky-400 hover:underline">← Volver al mapa</a>
        </div>
      </div>
    );
  }

  const location = locations[0];
  const forecast = await getForecast({
    latitude: location.latitude,
    longitude: location.longitude,
  });

  const current = forecast.current;
  const daily = forecast.daily;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="mb-6 inline-block text-sm text-sky-400 hover:underline">
          ← Volver al mapa
        </a>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {location.name}
            {location.admin1 && <span className="text-white/50">, {location.admin1}</span>}
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {location.country} · {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°{location.longitude >= 0 ? 'E' : 'O'}
            {location.elevation && ` · ${location.elevation}m`}
          </p>
        </div>

        {current && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-blue-600/5 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Ahora</p>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-light text-white">
                    {Math.round(current.temperature_2m)}°
                  </span>
                  <span className="mb-2 text-xl text-white/40">C</span>
                </div>
                <p className="mt-1 text-white/70">{getWeatherDescription(current.weather_code)}</p>
                <p className="text-sm text-white/40">
                  Sensación: {Math.round(current.apparent_temperature)}°C
                </p>
              </div>
              <span className="text-7xl">{getWeatherIcon(current.weather_code, current.is_day === 1)}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Humedad" value={`${current.relative_humidity_2m}%`} />
              <Stat label="Viento" value={`${Math.round(current.wind_speed_10m)} km/h`} />
              <Stat label="Presión" value={`${Math.round(current.pressure_msl)} hPa`} />
              <Stat label="Nubes" value={`${current.cloud_cover}%`} />
            </div>
          </div>
        )}

        {daily && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Pronóstico 7 Días</h2>
            <div className="space-y-3">
              {daily.time.map((day, i) => {
                const date = new Date(day);
                return (
                  <div key={day} className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-white/5">
                    <span className="w-20 text-sm font-medium capitalize text-white/70">
                      {i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-2xl">{getWeatherIcon(daily.weather_code[i], true)}</span>
                    <span className="flex-1 text-sm text-white/50">
                      {getWeatherDescription(daily.weather_code[i])}
                    </span>
                    {daily.precipitation_probability_max[i] > 0 && (
                      <span className="text-xs text-sky-400">💧 {daily.precipitation_probability_max[i]}%</span>
                    )}
                    <div className="text-right">
                      <span className="text-lg font-medium text-white">{Math.round(daily.temperature_2m_max[i])}°</span>
                      <span className="ml-1 text-sm text-white/40">{Math.round(daily.temperature_2m_min[i])}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

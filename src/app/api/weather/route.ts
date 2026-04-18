import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const preferredRegion = 'auto';

const OPEN_METEO_BASE = process.env.NEXT_PUBLIC_OPEN_METEO_BASE || 'https://api.open-meteo.com';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const model = searchParams.get('model');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,pressure_msl,surface_pressure,cape,dew_point_2m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
    timezone: 'auto',
    forecast_days: '7',
  });

  if (model) {
    params.set('models', model);
  }

  try {
    const res = await fetch(`${OPEN_METEO_BASE}/v1/forecast?${params}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 },
    );
  }
}

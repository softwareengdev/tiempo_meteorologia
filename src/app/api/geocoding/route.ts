import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const params = new URLSearchParams({
      name: query,
      count: '8',
      language: 'es',
      format: 'json',
    });

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    );

    if (!res.ok) {
      throw new Error(`Geocoding error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}

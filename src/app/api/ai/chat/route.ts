import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';
import type { CurrentWeather } from '@/types';

export const runtime = 'edge';

interface ChatBody {
  message: string;
  location: string;
  current?: CurrentWeather;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

const SYSTEM_PROMPT = `Eres AetherCast Asistente, un meteorólogo experto que responde en español de forma clara, breve y útil.
- Máximo 4 frases salvo que pidan detalles.
- Usa emojis con moderación (1-2 por respuesta).
- Cuando tengas datos meteorológicos en el contexto, basa tus respuestas en ellos.
- Si no sabes algo, dilo abiertamente sin inventar.
- Tono profesional pero cercano.`;

function buildContext(loc: string, c?: CurrentWeather): string {
  if (!c) return `Ubicación: ${loc}.`;
  return [
    `Ubicación: ${loc}.`,
    `Datos actuales:`,
    `- Temperatura: ${Math.round(c.temperature_2m)}°C (sensación ${Math.round(c.apparent_temperature)}°C).`,
    `- Humedad: ${c.relative_humidity_2m}%.`,
    `- Viento: ${Math.round(c.wind_speed_10m)} km/h, rachas ${Math.round(c.wind_gusts_10m)} km/h.`,
    `- Precipitación última hora: ${c.precipitation} mm.`,
    `- Presión: ${Math.round(c.pressure_msl)} hPa.`,
    `- Nubosidad: ${c.cloud_cover}%.`,
    `- Es de día: ${c.is_day === 1 ? 'sí' : 'no'}.`,
    `- WMO weather_code: ${c.weather_code}.`,
  ].join('\n');
}

async function callWorkersAI(body: ChatBody): Promise<string | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  if (!accountId || !token) return null;

  const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: buildContext(body.location, body.current) },
    ...(body.history ?? []).slice(-4),
    { role: 'user', content: body.message },
  ];

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ messages, max_tokens: 256, temperature: 0.4 }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: { response?: string } };
    return json?.result?.response?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body?.message?.trim()) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 });
  }

  const aiText = await callWorkersAI(body);

  if (aiText) {
    return NextResponse.json({ reply: aiText, source: 'workers-ai' });
  }

  const fallback = body.current
    ? generateAIResponse(body.message, body.current, body.location)
    : 'Aún no tengo datos meteorológicos para responder. Intenta seleccionar una ubicación primero.';

  return NextResponse.json({ reply: fallback, source: 'rules' });
}

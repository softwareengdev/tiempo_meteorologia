import type { CurrentWeather } from '@/types';
import { getWeatherDescription, getWindDirection } from '@/lib/weather';

export function generateWeatherSummary(current: CurrentWeather, locationName: string): string {
  const desc = getWeatherDescription(current.weather_code);
  const windDir = getWindDirection(current.wind_direction_10m);
  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const humidity = current.relative_humidity_2m;
  const wind = Math.round(current.wind_speed_10m);
  const gusts = Math.round(current.wind_gusts_10m);
  const pressure = Math.round(current.pressure_msl);

  let summary = `📍 **${locationName}** — ${desc}\n\n`;
  summary += `🌡️ Temperatura: **${temp}°C** (sensación térmica ${feelsLike}°C)\n`;
  summary += `💨 Viento: **${wind} km/h** del ${windDir}`;
  if (gusts > wind + 10) summary += ` con rachas de ${gusts} km/h`;
  summary += '\n';
  summary += `💧 Humedad: **${humidity}%**\n`;
  summary += `🔵 Presión: **${pressure} hPa**\n`;
  summary += `☁️ Nubes: **${current.cloud_cover}%**\n\n`;

  // Recommendations
  const recommendations: string[] = [];
  if (temp < 5) recommendations.push('🧥 Abrígate bien, hace frío');
  else if (temp < 15) recommendations.push('🧶 Lleva una chaqueta');
  else if (temp > 30) recommendations.push('🧴 Protégete del calor, usa protector solar');
  else if (temp > 35) recommendations.push('⚠️ Calor extremo, evita la exposición prolongada');

  if (current.precipitation > 0) recommendations.push('☔ Lleva paraguas, hay precipitación');
  if (current.snowfall > 0) recommendations.push('❄️ Precaución con la nieve');
  if (wind > 40) recommendations.push('💨 Viento fuerte, ten cuidado');
  if (humidity > 85) recommendations.push('🌫️ Humedad muy alta');
  if (current.weather_code >= 95) recommendations.push('⛈️ ¡Tormenta! Busca refugio');

  if (recommendations.length > 0) {
    summary += '### Recomendaciones\n';
    recommendations.forEach((r) => { summary += `- ${r}\n`; });
  }

  return summary;
}

export function generateAIResponse(question: string, current: CurrentWeather, locationName: string): string {
  const q = question.toLowerCase();

  if (q.includes('pongo') || q.includes('vestir') || q.includes('ropa')) {
    const temp = current.temperature_2m;
    if (temp < 0) return '🧥 Hace mucho frío. Ponte abrigo grueso, bufanda, guantes y gorro.';
    if (temp < 10) return '🧶 Temperatura baja. Ponte chaqueta de abrigo y capas.';
    if (temp < 20) return '👕 Clima templado. Una chaqueta ligera o sudadera estarán bien.';
    if (temp < 28) return '☀️ Buen tiempo. Ropa ligera, camiseta y pantalón cómodo.';
    return '🌞 Hace calor. Ropa ligera, gafas de sol y protector solar.';
  }

  if (q.includes('lluvia') || q.includes('llover') || q.includes('paraguas')) {
    if (current.precipitation > 0) return '☔ Sí, está lloviendo ahora. Lleva paraguas.';
    if (current.cloud_cover > 70) return '☁️ Está muy nublado, podría llover. Lleva paraguas por si acaso.';
    return '☀️ No parece que vaya a llover a corto plazo.';
  }

  if (q.includes('viento') || q.includes('wind')) {
    const wind = current.wind_speed_10m;
    if (wind < 10) return '🍃 El viento es muy suave, apenas se nota.';
    if (wind < 25) return '💨 Hay algo de viento pero es manejable.';
    if (wind < 50) return '💨 Viento moderado a fuerte. Ten cuidado con objetos ligeros.';
    return '🌪️ ¡Viento muy fuerte! Ten precaución al aire libre.';
  }

  if (q.includes('resumen') || q.includes('tiempo') || q.includes('clima')) {
    return generateWeatherSummary(current, locationName);
  }

  return generateWeatherSummary(current, locationName);
}

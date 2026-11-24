export type Trip = { from: string; destination: string };
export type Section = 'plan' | 'weather' | 'hotels';
export type Forecast = {
  date: string;
  temp: number;
  condition: string;
  snow: number;
  wind_speed: number;
};

export function validateTrip(from: unknown, destination: unknown): Trip | null {
  if (typeof from !== 'string' || typeof destination !== 'string') return null;
  const trip = { from: from.trim(), destination: destination.trim() };
  if (!trip.from || !trip.destination || trip.from.length > 100 || trip.destination.length > 100) return null;
  return trip;
}

export function demoSections(trip: Trip): Record<Section, string> {
  return {
    plan: [
      `1. Pot: ${trip.from} → ${trip.destination}. Pred odhodom preveri prevoz, parkirišče in razmere na cesti.`,
      '2. Smučanje: na zemljevidu smučišča izberi proge glede na svoje znanje in preveri odprtost žičnic.',
      '3. Oprema: pripravi čelado, očala, rokavice in rezervni sloj oblačil.',
    ].join('\n\n'),
    weather: 'Vzorčni prikaz: −3 °C, rahel sneg, veter 4 m/s. To so izmišljeni podatki za preizkus aplikacije.',
    hotels: `Za izlet v ${trip.destination} primerjaj oddaljenost nastanitve od žičnice, dostop s smučarskim avtobusom in pogoje odpovedi.`,
  };
}

export async function loadSection(
  baseUrl: string, section: Section, trip: Trip, signal?: AbortSignal,
): Promise<string | Forecast[]> {
  const path = section === 'plan' ? '/plan' : `/${section}/${encodeURIComponent(trip.destination)}`;
  const options: RequestInit = { signal };
  if (section === 'plan') {
    options.method = 'POST';
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify({ destination: trip.destination, from_location: trip.from });
  }

  const response = await fetch(baseUrl.replace(/\/+$/, '') + path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : `Napaka strežnika (${response.status}).`);
  }
  if (section === 'weather') {
    if (typeof data?.error === 'string') throw new Error(data.error);
    if (Array.isArray(data?.forecasts) && data.forecasts.length > 0) return data.forecasts;
  } else {
    const result = section === 'plan' ? data?.plan : data;
    if (typeof result === 'string' && result.trim()) return result;
  }
  throw new Error('Strežnik ni vrnil podatkov za ta razdelek.');
}

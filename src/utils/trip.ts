export type Trip = { from: string; destination: string };
export type Section = 'plan' | 'weather' | 'hotels';

export function validateTrip(from: unknown, destination: unknown): Trip | null {
  if (typeof from !== 'string' || typeof destination !== 'string') return null;
  const trip = { from: from.trim(), destination: destination.trim() };
  if (!trip.from || !trip.destination || trip.from.length > 100 || trip.destination.length > 100) return null;
  return trip;
}

export function tripSections(trip: Trip): Record<Section, string> {
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

import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '../components/action-button';
import { colors, styles } from '../theme';
import { demoSections, loadSection, validateTrip } from '../utils/trip';
import type { Forecast, Section, Trip } from '../utils/trip';

const tabs: { id: Section; label: string }[] = [
  { id: 'plan', label: 'Načrt' },
  { id: 'weather', label: 'Vreme' },
  { id: 'hotels', label: 'Hoteli' },
];
const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
type Result = { data: string | Forecast[] } | { error: string };
type Results = Partial<Record<Section, Result>>;

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const trip = validateTrip(params.from, params.destination);

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {trip ? <TripResults key={JSON.stringify(trip)} trip={trip} /> : (
          <View style={styles.card}>
            <Text style={styles.error}>Manjkata kraj odhoda ali smučarski cilj.</Text>
            <ActionButton label="Odpri obrazec" onPress={() => router.replace('/')} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TripResults({ trip }: { trip: Trip }) {
  const { from, destination } = trip;
  const [section, setSection] = useState<Section>('plan');
  const [results, setResults] = useState<Results>({});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!apiUrl) return;
    const controller = new AbortController();
    for (const { id } of tabs) {
      const request = new AbortController();
      const cancel = () => request.abort();
      controller.signal.addEventListener('abort', cancel, { once: true });
      const timeout = setTimeout(cancel, 60000);

      async function load(url: string) {
        let result: Result;
        try {
          result = { data: await loadSection(url, id, { from, destination }, request.signal) };
        } catch (error) {
          const message = request.signal.aborted
            ? 'Strežnik ni odgovoril pravočasno.'
            : error instanceof Error && !(error instanceof TypeError)
              ? error.message
              : 'Povezava s strežnikom ni uspela. Preveri naslov API in povezavo.';
          result = { error: message };
        } finally {
          clearTimeout(timeout);
          controller.signal.removeEventListener('abort', cancel);
        }
        if (!controller.signal.aborted) {
          setResults(previous => ({ ...previous, [id]: result }));
        }
      }
      void load(apiUrl);
    }
    return () => controller.abort();
  }, [from, destination, attempt]);

  const result = apiUrl ? results[section] : { data: demoSections(trip)[section] };
  return (
    <>
      <View>
        <Text accessibilityRole="header" style={styles.title}>{destination}</Text>
        <Text style={styles.muted}>Odhod iz kraja {from}</Text>
        <Link
          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(destination)}&travelmode=driving`}
          style={local.mapLink}
        >
          Odpri pot v Google Zemljevidih
        </Link>
      </View>
      {!apiUrl && <Text style={styles.muted}>Predstavitveni način · vzorčni podatki</Text>}
      <View style={local.tabs} accessibilityRole="tablist">
        {tabs.map(tab => (
          <View key={tab.id} style={local.tab}>
            <ActionButton label={tab.label} selected={tab.id === section} onPress={() => setSection(tab.id)} />
          </View>
        ))}
      </View>
      <View style={styles.card}>
        {!result ? (
          <>
            <ActivityIndicator color={colors.ice} />
            <Text accessibilityLiveRegion="polite" style={styles.muted}>Nalagam podatke …</Text>
          </>
        ) : 'error' in result ? (
          <>
            <Text accessibilityRole="alert" style={styles.error}>{result.error}</Text>
            <ActionButton label="Poskusi znova" onPress={() => {
              setResults({});
              setAttempt(value => value + 1);
            }} />
          </>
        ) : typeof result.data === 'string' ? (
          <Text selectable style={styles.body}>{result.data}</Text>
        ) : (
          <>
            <Text style={styles.muted}>Naslednji termini · UTC</Text>
            {result.data.map(item => (
              <View key={item.date} style={local.forecast}>
                <Text style={styles.heading}>{Math.round(item.temp)} °C</Text>
                <Text style={styles.body}>{item.date.slice(0, 16)} · {item.condition}</Text>
                <Text style={styles.muted}>Veter {item.wind_speed.toFixed(1)} m/s · sneg {item.snow.toFixed(1)} mm</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </>
  );
}

const local = StyleSheet.create({
  mapLink: { color: colors.ice, fontSize: 16, paddingVertical: 10, textDecorationLine: 'underline' },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1 },
  forecast: { borderTopWidth: 1, borderColor: colors.border, paddingTop: 10, gap: 3 },
});

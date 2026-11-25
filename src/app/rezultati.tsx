import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '../components/action-button';
import { styles } from '../theme';
import { tripSections, validateTrip } from '../utils/trip';
import type { Section, Trip } from '../utils/trip';

const tabs: { id: Section; label: string }[] = [
  { id: 'plan', label: 'Načrt' },
  { id: 'weather', label: 'Vreme' },
  { id: 'hotels', label: 'Hoteli' },
];
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
  const sections = tripSections(trip);

  return (
    <>
      <View>
        <Text accessibilityRole="header" style={styles.title}>{destination}</Text>
        <Text style={styles.muted}>Odhod iz kraja {from}</Text>
      </View>
      <View style={local.tabs} accessibilityRole="tablist">
        {tabs.map(tab => (
          <View key={tab.id} style={local.tab}>
            <ActionButton label={tab.label} selected={tab.id === section} onPress={() => setSection(tab.id)} />
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text selectable style={styles.body}>{sections[section]}</Text>
      </View>
    </>
  );
}

const local = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1 },
});

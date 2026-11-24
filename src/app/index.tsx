import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Keyboard, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '../components/action-button';
import { RouteField } from '../components/route-field';
import { styles } from '../theme';
import { validateTrip } from '../utils/trip';

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  function planTrip() {
    const trip = validateTrip(from, destination);
    if (!trip) {
      setError('Vnesi kraj odhoda in smučarski cilj.');
      return;
    }
    setError('');
    Keyboard.dismiss();
    router.push({ pathname: '/rezultati', params: trip });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text accessibilityRole="header" style={styles.title}>SkiPlan AI</Text>
          <Text style={styles.muted}>Načrtuj pot, preveri vreme in poišči nastanitev.</Text>
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.heading}>Načrtuj smučarski izlet</Text>
          <RouteField label="Kraj odhoda" placeholder="npr. Ljubljana" value={from} onChange={setFrom} />
          <RouteField label="Smučarski cilj" placeholder="npr. Kranjska Gora" value={destination} onChange={setDestination} />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <ActionButton label="Načrtuj izlet" onPress={planTrip} />
        </View>
        {!process.env.EXPO_PUBLIC_API_URL?.trim() &&
          <Text style={styles.muted}>Predstavitveni način · vzorčni podatki</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

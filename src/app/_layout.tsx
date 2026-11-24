import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerBackButtonDisplayMode: 'minimal',
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="rezultati" options={{ title: 'Smučarski izlet' }} />
      </Stack>
    </>
  );
}

import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0b1524',
  surface: '#132237',
  field: '#0d192a',
  border: '#334963',
  text: '#f3f7ff',
  muted: '#b4c4d9',
  ice: '#8be0ff',
  error: '#ffb4b4',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 660, alignSelf: 'center', padding: 20, gap: 18 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 18, gap: 12 },
  title: { color: colors.text, fontSize: 36, fontWeight: '800' },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700' },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
  muted: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  error: { color: colors.error, fontSize: 15, lineHeight: 22 },
});

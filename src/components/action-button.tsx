import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = { label: string; onPress: () => void; selected?: boolean };

export function ActionButton({ label, onPress, selected }: Props) {
  const isTab = selected !== undefined;
  return (
    <Pressable
      accessibilityRole={isTab ? 'tab' : 'button'}
      aria-selected={selected}
      onPress={onPress}
      style={({ pressed }) => [
        local.button,
        selected === false && local.inactive,
        pressed && local.pressed,
      ]}
    >
      <Text style={[local.label, selected === false && local.inactiveLabel]}>{label}</Text>
    </Pressable>
  );
}

const local = StyleSheet.create({
  button: { backgroundColor: colors.ice, borderRadius: 12, minHeight: 46, padding: 12, justifyContent: 'center' },
  inactive: { backgroundColor: colors.field },
  pressed: { opacity: 0.75 },
  label: { color: colors.background, textAlign: 'center', fontSize: 15, fontWeight: '700' },
  inactiveLabel: { color: colors.text },
});

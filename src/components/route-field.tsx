import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, styles } from '../theme';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function RouteField({ label, placeholder, value, onChange }: Props) {
  return (
    <View style={local.group}>
      <Text style={styles.body}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChange}
        autoCapitalize="words"
        maxLength={100}
        style={local.input}
      />
    </View>
  );
}

const local = StyleSheet.create({
  group: { gap: 6 },
  input: {
    backgroundColor: colors.field, borderColor: colors.border, borderWidth: 1,
    borderRadius: 12, color: colors.text, minHeight: 48, paddingHorizontal: 12, fontSize: 16,
  },
});

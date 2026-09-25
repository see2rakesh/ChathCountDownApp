import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, MAX_W, R, S } from './theme';

export function Screen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + S.xxl }]}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function H1({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}
export function Body({ children, style, muted }: { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean }) {
  return <Text style={[styles.body, muted && { color: C.muted }, style]}>{children}</Text>;
}
export function Small({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.small, style]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
}) {
  const outline = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, outline && styles.btnOutline, pressed && { opacity: 0.75 }, style]}>
      <Text style={[styles.btnText, outline && { color: C.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}>
      <Text style={styles.chipText} numberOfLines={1}>
        📍 {label} ▾
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: S.lg, paddingTop: S.lg, alignItems: 'center' },
  inner: { width: '100%', maxWidth: MAX_W, gap: S.lg },
  card: {
    backgroundColor: C.surface,
    borderRadius: R.lg,
    padding: S.lg,
    borderWidth: 1,
    borderColor: C.border,
    gap: S.sm,
  },
  h1: { fontSize: 24, fontWeight: '800', color: C.text },
  h2: { fontSize: 18, fontWeight: '700', color: C.text },
  body: { fontSize: 15, lineHeight: 22, color: C.text },
  small: { fontSize: 12, lineHeight: 17, color: C.muted },
  btn: {
    backgroundColor: C.primary,
    borderRadius: R.pill,
    paddingVertical: S.md,
    paddingHorizontal: S.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  btnOutline: { backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: C.surfaceWarm,
    borderRadius: R.pill,
    paddingVertical: S.sm,
    paddingHorizontal: S.md,
    borderWidth: 1,
    borderColor: C.border,
    maxWidth: '100%',
  },
  chipText: { color: C.primaryDark, fontWeight: '700', fontSize: 14 },
});

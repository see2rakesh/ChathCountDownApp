import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/lib/settings';
import { splitDuration } from '@/lib/time';
import { R, S } from './theme';

export function Countdown({ ms, light = true, compact = false }: { ms: number; light?: boolean; compact?: boolean }) {
  const { t } = useSettings();
  const d = splitDuration(ms);
  const units: [number, string][] = [
    [d.days, t('days')],
    [d.hours, t('hours')],
    [d.minutes, t('minutes')],
    [d.seconds, t('seconds')],
  ];
  const color = light ? '#fff' : '#3A1D0B';
  return (
    <View style={styles.row} accessibilityRole="timer">
      {units.map(([v, label]) => (
        <View key={label} style={[styles.box, compact && styles.boxCompact, { backgroundColor: light ? 'rgba(255,255,255,0.18)' : '#FFF0DC' }]}>
          <Text style={[styles.num, compact && styles.numCompact, { color }]}>{String(v).padStart(2, '0')}</Text>
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: S.sm },
  box: { flex: 1, borderRadius: R.md, paddingVertical: S.md, alignItems: 'center' },
  boxCompact: { paddingVertical: S.sm },
  num: { fontSize: 32, fontWeight: '800', fontVariant: ['tabular-nums'] },
  numCompact: { fontSize: 22 },
  label: { fontSize: 12, fontWeight: '600', opacity: 0.9 },
});

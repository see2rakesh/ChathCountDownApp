import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { Ritual } from '@/data/festival';
import { useSettings } from '@/lib/settings';
import { getDistrict, ritualInstant } from '@/lib/sun';
import { formatDate, formatTime, formatTimeSeconds } from '@/lib/time';
import { useNow } from '@/lib/use-now';
import { Countdown } from './countdown';
import { C, R, S } from './theme';

export function ArghyaCard({ ritual }: { ritual: Ritual }) {
  const { settings, t } = useSettings();
  const now = useNow();
  const lang = settings.lang;
  const district = getDistrict(settings.districtId);
  const at = ritualInstant(ritual, district);
  const left = at.getTime() - now;
  const isSunset = ritual.anchor === 'sunset';
  const colors = (isSunset ? [C.duskFrom, C.duskTo] : [C.dawnFrom, C.dawnTo]) as [string, string];

  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.icon}>{isSunset ? '🌇' : '🌅'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{ritual.name[lang]}</Text>
          <Text style={styles.date}>
            {formatDate(ritual.date, lang)} · {district[lang]}
          </Text>
        </View>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>{isSunset ? t('sunsetOn') : t('sunriseOn')}</Text>
        <Text style={styles.time}>{formatTime(at)}</Text>
        <Text style={styles.exact}>{formatTimeSeconds(at)} IST</Text>
      </View>
      {left > 0 ? (
        <>
          <Text style={styles.leftLabel}>{t('timeLeft')}</Text>
          <Countdown ms={left} compact />
        </>
      ) : (
        <Text style={styles.done}>✓ {t('done')}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: R.lg, padding: S.lg, gap: S.sm, flex: 1, minWidth: 280 },
  top: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  icon: { fontSize: 34 },
  name: { color: '#fff', fontSize: 20, fontWeight: '800' },
  date: { color: '#fff', opacity: 0.92, fontSize: 13, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'baseline', gap: S.sm, flexWrap: 'wrap', marginTop: S.xs },
  timeLabel: { color: '#fff', fontSize: 15, fontWeight: '700' },
  time: { color: '#fff', fontSize: 34, fontWeight: '900', fontVariant: ['tabular-nums'] },
  exact: { color: '#fff', opacity: 0.9, fontSize: 13, fontVariant: ['tabular-nums'] },
  leftLabel: { color: '#fff', fontSize: 12, fontWeight: '700', opacity: 0.9, textTransform: 'uppercase' },
  done: { color: '#fff', fontSize: 18, fontWeight: '800' },
});

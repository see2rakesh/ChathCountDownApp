import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Countdown } from '@/components/countdown';
import { DistrictPicker } from '@/components/district-picker';
import { C, R, S } from '@/components/theme';
import { Body, Card, H2, Screen, Small } from '@/components/ui';
import { useSettings } from '@/lib/settings';
import { songForDate, useSongs, youtubeThumb } from '@/lib/songs';
import { currentEdition, getDistrict, nextRitual, sunTimes } from '@/lib/sun';
import { formatDate, formatDayMonth, formatTime, istDateString } from '@/lib/time';
import { useNow } from '@/lib/use-now';

export default function HomeScreen() {
  const { settings, t } = useSettings();
  const lang = settings.lang;
  const router = useRouter();
  const now = useNow();
  const today = istDateString(now);
  const district = getDistrict(settings.districtId);
  const edition = currentEdition(now);
  const next = nextRitual(edition, district, now);
  const todaySun = sunTimes(today, district);
  const songs = useSongs();
  const { song } = songForDate(songs, today);
  const first = edition.rituals[0];
  const last = edition.rituals[edition.rituals.length - 1];

  return (
    <Screen>
      <DistrictPicker />

      <LinearGradient colors={[C.heroFrom, C.heroTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroKicker}>🪔 {edition.title[lang]}</Text>
        <Text style={styles.heroDates}>
          {formatDate(first.date, lang)} – {formatDate(last.date, lang)}
        </Text>
        {next ? (
          <>
            <View style={styles.nextRow}>
              <Text style={styles.nextLabel}>
                {next.ritual.date === today ? t('today') : t('next')} · {t('day')} {next.ritual.day}
              </Text>
              <Text style={styles.nextName}>{next.ritual.name[lang]}</Text>
              <Text style={styles.nextWhen}>
                {formatDate(next.ritual.date, lang)} · {next.ritual.anchor === 'sunrise' ? t('sunrise') : t('sunset')}{' '}
                {formatTime(next.at)} ({district[lang]})
              </Text>
            </View>
            <Countdown ms={next.at.getTime() - now} />
          </>
        ) : (
          <Text style={styles.nextName}>{t('festivalDone')}</Text>
        )}
      </LinearGradient>

      <View style={styles.strip}>
        {edition.rituals.map((r) => {
          const isToday = r.date === today;
          const past = r.date < today;
          return (
            <Pressable
              key={r.key}
              accessibilityRole="button"
              onPress={() => router.push('/anushthan')}
              style={[styles.stripItem, isToday && styles.stripToday, past && { opacity: 0.55 }]}>
              <Text style={[styles.stripDay, isToday && { color: '#fff' }]}>
                {past ? '✓' : `${t('day')} ${r.day}`}
              </Text>
              <Text style={[styles.stripName, isToday && { color: '#fff' }]} numberOfLines={2}>
                {r.short[lang]}
              </Text>
              <Text style={[styles.stripDate, isToday && { color: '#fff' }]}>{formatDayMonth(r.date, lang)}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.sunCard}>
        <View style={styles.sunCol}>
          <Text style={styles.sunIcon}>🌅</Text>
          <Small>
            {t('today')} · {t('sunrise')}
          </Small>
          <Text style={styles.sunTime}>{formatTime(todaySun.sunrise)}</Text>
        </View>
        <View style={styles.sunDivider} />
        <View style={styles.sunCol}>
          <Text style={styles.sunIcon}>🌇</Text>
          <Small>
            {t('today')} · {t('sunset')}
          </Small>
          <Text style={styles.sunTime}>{formatTime(todaySun.sunset)}</Text>
        </View>
      </Card>

      <Pressable accessibilityRole="button" onPress={() => router.push('/geet')}>
        <Card>
          <H2>🎵 {t('todaysGeet')}</H2>
          <View style={styles.songRow}>
            <Image source={{ uri: youtubeThumb(song.youtubeId) }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.songTitle} numberOfLines={2}>
                {song.title[lang]}
              </Text>
              <Small>{t('tributeTitle')}</Small>
              <Body muted style={{ fontSize: 13, lineHeight: 18 }} >
                {song.note[lang]}
              </Body>
            </View>
          </View>
          <Text style={styles.link}>{t('listenNow')} →</Text>
        </Card>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: R.lg, padding: S.xl, gap: S.md },
  heroKicker: { color: '#fff', fontSize: 22, fontWeight: '900' },
  heroDates: { color: '#fff', fontSize: 14, fontWeight: '600', opacity: 0.95, marginTop: -S.sm },
  nextRow: { gap: 2, marginTop: S.sm },
  nextLabel: { color: '#fff', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', opacity: 0.9 },
  nextName: { color: '#fff', fontSize: 30, fontWeight: '900' },
  nextWhen: { color: '#fff', fontSize: 14, fontWeight: '600' },
  strip: { flexDirection: 'row', gap: S.sm },
  stripItem: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.sm,
    alignItems: 'center',
    gap: 2,
  },
  stripToday: { backgroundColor: C.primary, borderColor: C.primary },
  stripDay: { fontSize: 11, fontWeight: '800', color: C.primary },
  stripName: { fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center', minHeight: 32 },
  stripDate: { fontSize: 11, color: C.muted },
  sunCard: { flexDirection: 'row', alignItems: 'center' },
  sunCol: { flex: 1, alignItems: 'center', gap: 2 },
  sunIcon: { fontSize: 26 },
  sunTime: { fontSize: 22, fontWeight: '800', color: C.text, fontVariant: ['tabular-nums'] },
  sunDivider: { width: 1, alignSelf: 'stretch', backgroundColor: C.border },
  songRow: { flexDirection: 'row', gap: S.md, alignItems: 'flex-start' },
  thumb: { width: 120, height: 90, borderRadius: R.sm, backgroundColor: '#000' },
  songTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  link: { color: C.primary, fontWeight: '800', marginTop: S.xs },
});

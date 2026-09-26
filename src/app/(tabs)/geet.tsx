import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, R, S } from '@/components/theme';
import { Body, Card, H1, H2, Screen, Small } from '@/components/ui';
import { YouTubeVideo } from '@/components/youtube-player';
import { useSettings } from '@/lib/settings';
import { seriesBounds, songForDate, sortedSongs, useSongs, youtubeThumb, type Song } from '@/lib/songs';
import { getDistrict } from '@/lib/sun';
import { formatDate, localDateString } from '@/lib/time';
import { useNow } from '@/lib/use-now';

export default function GeetScreen() {
  const { settings, t } = useSettings();
  const lang = settings.lang;
  const now = useNow(60_000);
  const today = localDateString(getDistrict(settings.districtId).tz, now);
  const file = useSongs();
  const { start } = seriesBounds(file);
  const todays = songForDate(file, today);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = sortedSongs(file);
  const earlier = all.filter((s) => s.date < today).reverse();
  const upcoming = all.filter((s) => s.date > today).length;
  const song: Song = all.find((s) => s.youtubeId === selectedId) ?? todays.song;
  const isToday = song.youtubeId === todays.song.youtubeId;
  const beforeSeries = today < start;

  return (
    <Screen>
      <View style={{ gap: 2 }}>
        <H1>{t('songOfDay')}</H1>
        <Body muted>
          {isToday ? `${t('today')} · ${formatDate(today, lang)}` : formatDate(song.date, lang)}
          {isToday && beforeSeries ? ` · ${t('preview')}` : ''}
        </Body>
      </View>

      {beforeSeries && (
        <Card style={styles.notice}>
          <Body>
            🗓️ {t('seriesStarts')} <Text style={{ fontWeight: '800' }}>{formatDate(start, lang)}</Text>
          </Body>
        </Card>
      )}

      <YouTubeVideo videoId={song.youtubeId} />

      <Card>
        <View style={styles.titleRow}>
          <H2 style={{ flex: 1 }}>{song.title[lang]}</H2>
          {song.kind === 'jukebox' && <Text style={styles.tag}>{t('jukebox')}</Text>}
        </View>
        <Body>{song.note[lang]}</Body>
        <Small>
          {t('singer')}: {t('tributeTitle')} · {t('album')}: {song.album}
        </Small>
        <Small>
          {t('channel')}: {song.channel}
        </Small>
      </Card>

      {!isToday && (
        <Pressable accessibilityRole="button" onPress={() => setSelectedId(null)}>
          <Text style={styles.link}>← {t('todaysGeet')}</Text>
        </Pressable>
      )}

      {earlier.length > 0 && <H2>{t('previousSongs')}</H2>}
      {earlier.map((s) => (
        <Pressable key={s.youtubeId} accessibilityRole="button" onPress={() => setSelectedId(s.youtubeId)}>
          <View style={[styles.row, s.youtubeId === song.youtubeId && styles.rowActive]}>
            <Image source={{ uri: youtubeThumb(s.youtubeId) }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle} numberOfLines={2}>
                {s.title[lang]}
              </Text>
              <Small>{formatDate(s.date, lang)}</Small>
            </View>
          </View>
        </Pressable>
      ))}
      {upcoming > 0 && (
        <Small style={{ textAlign: 'center' }}>
          🔒 {upcoming} {t('upcomingSongs')}
        </Small>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { backgroundColor: C.surfaceWarm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  tag: {
    backgroundColor: C.gold,
    color: C.text,
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    borderRadius: R.pill,
    overflow: 'hidden',
  },
  link: { color: C.primary, fontWeight: '800' },
  row: {
    flexDirection: 'row',
    gap: S.md,
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: R.md,
    padding: S.sm,
    borderWidth: 1,
    borderColor: C.border,
  },
  rowActive: { borderColor: C.primary, borderWidth: 2 },
  thumb: { width: 96, height: 54, borderRadius: R.sm, backgroundColor: '#000' },
  rowTitle: { fontSize: 15, fontWeight: '700', color: C.text },
});

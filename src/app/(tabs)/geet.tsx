import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { C, R, S } from '@/components/theme';
import { Body, Card, H1, H2, Screen, Small } from '@/components/ui';
import { YouTubeVideo } from '@/components/youtube-player';
import { usePlaylist } from '@/lib/playlist';
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
  const playlist = usePlaylist();
  const { start } = seriesBounds(file);
  const todays = songForDate(file, today);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** A playlist song playing in the top player instead of the daily geet. */
  const [playId, setPlayId] = useState<string | null>(null);
  const [singerFilter, setSingerFilter] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const all = sortedSongs(file);
  const earlier = all.filter((s) => s.date < today).reverse();
  const upcoming = all.filter((s) => s.date > today).length;
  const song: Song = all.find((s) => s.youtubeId === selectedId) ?? todays.song;
  const isToday = song.youtubeId === todays.song.youtubeId;
  const beforeSeries = today < start;
  const playing = playlist.songs.find((s) => s.youtubeId === playId);
  const singerName = (id: string) => playlist.singers.find((s) => s.id === id)?.name[lang] ?? '';
  const shown = playlist.songs.filter((s) => !singerFilter || s.singer === singerFilter);

  const play = (id: string) => {
    setPlayId(id);
    setSelectedId(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  const backToToday = () => {
    setPlayId(null);
    setSelectedId(null);
  };

  return (
    <Screen scrollRef={scrollRef}>
      {playing ? (
        <>
          <View style={{ gap: 2 }}>
            <H1>🎶 {t('playlist')}</H1>
            <Body muted>{singerName(playing.singer)}</Body>
          </View>
          <YouTubeVideo videoId={playing.youtubeId} />
          <Card>
            <View style={styles.titleRow}>
              <H2 style={{ flex: 1 }}>{playing.title[lang]}</H2>
              {playing.jukebox && <Text style={styles.tag}>{t('jukebox')}</Text>}
            </View>
            <Small>
              {t('singer')}: {singerName(playing.singer)}
            </Small>
            <Small>
              {t('channel')}: {playing.channel}
            </Small>
          </Card>
        </>
      ) : (
        <>
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
        </>
      )}

      {(!isToday || playing) && (
        <Pressable accessibilityRole="button" onPress={backToToday}>
          <Text style={styles.link}>← {t('todaysGeet')}</Text>
        </Pressable>
      )}

      {earlier.length > 0 && <H2>{t('previousSongs')}</H2>}
      {earlier.map((s) => (
        <Pressable
          key={s.youtubeId}
          accessibilityRole="button"
          onPress={() => {
            setPlayId(null);
            setSelectedId(s.youtubeId);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          }}>
          <View style={[styles.row, !playing && s.youtubeId === song.youtubeId && styles.rowActive]}>
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

      <View style={{ gap: 2, marginTop: S.md }}>
        <H2>🎶 {t('playlist')}</H2>
        <Small>{t('playlistSub')}</Small>
      </View>
      <View style={styles.chips}>
        {[{ id: null as string | null, label: t('allSingers') }, ...playlist.singers.map((s) => ({ id: s.id as string | null, label: s.name[lang] }))].map(
          (c) => {
            const on = c.id === singerFilter;
            return (
              <Pressable
                key={c.id ?? 'all'}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setSingerFilter(c.id)}
                style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && { color: '#fff' }]}>{c.label}</Text>
              </Pressable>
            );
          },
        )}
      </View>
      {shown.map((s) => (
        <Pressable key={s.youtubeId} accessibilityRole="button" onPress={() => play(s.youtubeId)}>
          <View style={[styles.row, s.youtubeId === playId && styles.rowActive]}>
            <Image source={{ uri: youtubeThumb(s.youtubeId) }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle} numberOfLines={2}>
                {s.title[lang]}
              </Text>
              <Small>
                {singerName(s.singer)}
                {s.jukebox ? ` · ${t('jukebox')}` : ''}
              </Small>
            </View>
          </View>
        </Pressable>
      ))}
      <Small>ⓘ {t('playlistRights')}</Small>
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  chip: { borderWidth: 1, borderColor: C.border, borderRadius: R.pill, paddingVertical: S.xs, paddingHorizontal: S.md, backgroundColor: C.surface },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 13, fontWeight: '700', color: C.primaryDark },
});

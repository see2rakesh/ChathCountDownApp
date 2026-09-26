import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArghyaCard } from '@/components/arghya-card';
import { DistrictPicker } from '@/components/district-picker';
import { C, R, S } from '@/components/theme';
import { Body, Card, H1, H2, Screen, Small } from '@/components/ui';
import { useSettings } from '@/lib/settings';
import { countryOf, currentEdition, DISTRICTS, getDistrict, getState, sunTimes } from '@/lib/sun';
import { formatDate, formatDayMonth, formatTime, localDateString } from '@/lib/time';
import { useNow } from '@/lib/use-now';

export default function RitualsScreen() {
  const { settings, t } = useSettings();
  const lang = settings.lang;
  const now = useNow(60_000);
  const edition = currentEdition(now);
  const district = getDistrict(settings.districtId);
  const today = localDateString(district.tz, now);
  const [showAll, setShowAll] = useState(false);
  const sandhya = edition.rituals.find((r) => r.key === 'sandhyaArghya')!;
  const usha = edition.rituals.find((r) => r.key === 'ushaArghya')!;

  return (
    <Screen>
      <DistrictPicker />
      <View style={{ gap: 2 }}>
        <H1>{t('arghyaTimer')}</H1>
        <Body muted>{t('arghyaTimerSub')}</Body>
      </View>
      <View style={styles.cards}>
        <ArghyaCard ritual={sandhya} />
        <ArghyaCard ritual={usha} />
      </View>
      <Small>ⓘ {t('sunNote')}</Small>

      <H2 style={{ marginTop: S.sm }}>{t('fourDays')}</H2>
      {edition.rituals.map((r) => {
        const sun = sunTimes(r.date, district);
        const isToday = r.date === today;
        return (
          <Card key={r.key} style={isToday ? { borderColor: C.primary, borderWidth: 2 } : undefined}>
            <View style={styles.dayHead}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{r.day}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <H2>{r.name[lang]}</H2>
                <Small>
                  {formatDate(r.date, lang)} · {r.tithi[lang]}
                  {isToday ? ` · ${t('today')}` : ''}
                </Small>
              </View>
            </View>
            <View style={styles.sunRow}>
              <Text style={styles.sunPill}>
                🌅 {t('sunrise')} {formatTime(sun.sunrise, district.tz)}
              </Text>
              <Text style={styles.sunPill}>
                🌇 {t('sunset')} {formatTime(sun.sunset, district.tz)}
              </Text>
            </View>
            <Body>{r.summary[lang]}</Body>
            {r.details.map((d, i) => (
              <Body key={i} muted>
                • {d[lang]}
              </Body>
            ))}
            <Body>
              <Text style={{ fontWeight: '800' }}>{t('prasad')}: </Text>
              {r.prasad[lang]}
            </Body>
          </Card>
        );
      })}

      <Card>
        <Pressable accessibilityRole="button" onPress={() => setShowAll((v) => !v)} style={styles.allHead}>
          <H2 style={{ flex: 1 }}>
            {district.kind === 'city' && countryOf(district) !== 'in' ? t('allCities') : t('allDistricts')} {getState(district.state)?.[lang]}
          </H2>
          <Text style={styles.link}>{showAll ? t('hideAll') : t('showAll')}</Text>
        </Pressable>
        {showAll && (
          <View>
            <View style={[styles.tr, styles.th]}>
              <Text style={[styles.td, styles.tdName, styles.thText]}>{t('district')}</Text>
              <Text style={[styles.td, styles.thText]}>
                🌇 {formatDayMonth(sandhya.date, lang)}
              </Text>
              <Text style={[styles.td, styles.thText]}>
                🌅 {formatDayMonth(usha.date, lang)}
              </Text>
            </View>
            {DISTRICTS.filter((d) => d.state === district.state && (countryOf(district) !== 'in' || d.kind === 'district'))
              .sort((a, b) => a[lang].localeCompare(b[lang]))
              .map((d) => (
                <View key={d.id} style={[styles.tr, d.id === district.id && { backgroundColor: C.surfaceWarm }]}>
                  <Text style={[styles.td, styles.tdName]} numberOfLines={2}>
                    {d[lang]}
                  </Text>
                  <Text style={styles.td}>{formatTime(sunTimes(sandhya.date, d).sunset, d.tz)}</Text>
                  <Text style={styles.td}>{formatTime(sunTimes(usha.date, d).sunrise, d.tz)}</Text>
                </View>
              ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: S.md },
  dayHead: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  badge: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  sunRow: { flexDirection: 'row', gap: S.sm, flexWrap: 'wrap' },
  sunPill: {
    backgroundColor: C.surfaceWarm,
    color: C.primaryDark,
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    borderRadius: R.pill,
    overflow: 'hidden',
  },
  allHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: C.primary, fontWeight: '800' },
  tr: { flexDirection: 'row', paddingVertical: S.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  th: { borderBottomWidth: 1 },
  thText: { fontWeight: '800', color: C.primaryDark },
  td: { flex: 1, fontSize: 14, color: C.text, fontVariant: ['tabular-nums'], textAlign: 'right' },
  tdName: { flex: 1.6, textAlign: 'left' },
});

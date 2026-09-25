import { useState } from 'react';
import { Platform, Pressable, Share, StyleSheet, Switch, Text, View } from 'react-native';

import { DistrictPicker } from '@/components/district-picker';
import { C, R, S } from '@/components/theme';
import { Body, Card, H2, Screen, Small } from '@/components/ui';
import { APP_VERSION, SHARE_URL } from '@/lib/config';
import type { Lang } from '@/lib/i18n';
import { ensurePermission, NOTIFICATIONS_SUPPORTED } from '@/lib/notifications';
import { useSettings, type Settings } from '@/lib/settings';

export default function SettingsScreen() {
  const { settings, update, t } = useSettings();
  const [denied, setDenied] = useState(false);

  const toggle = async (key: keyof Pick<Settings, 'dailyReminder' | 'ritualReminders'>, value: boolean) => {
    if (value) {
      const ok = await ensurePermission();
      setDenied(!ok);
      if (!ok) return;
    }
    update({ [key]: value });
  };

  const share = () => {
    const message = `${t('shareMessage')} ${SHARE_URL}`.trim();
    if (Platform.OS === 'web') {
      const nav = globalThis.navigator as Navigator | undefined;
      if (nav?.share) nav.share({ text: message, url: SHARE_URL || globalThis.location?.href }).catch(() => {});
      else nav?.clipboard?.writeText(`${message} ${globalThis.location?.href ?? ''}`).catch(() => {});
      return;
    }
    Share.share({ message }).catch(() => {});
  };

  return (
    <Screen>
      <Card>
        <H2>{t('language')}</H2>
        <View style={styles.segment}>
          {(['hi', 'en'] as Lang[]).map((l) => (
            <Pressable
              key={l}
              accessibilityRole="button"
              accessibilityState={{ selected: settings.lang === l }}
              onPress={() => update({ lang: l })}
              style={[styles.segBtn, settings.lang === l && styles.segOn]}>
              <Text style={[styles.segText, settings.lang === l && { color: '#fff' }]}>{l === 'hi' ? 'हिंदी' : 'English'}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <H2>{t('district')}</H2>
        <DistrictPicker />
      </Card>

      <Card>
        <H2>{t('reminders')}</H2>
        {NOTIFICATIONS_SUPPORTED ? (
          <>
            <View style={styles.switchRow}>
              <Body style={{ flex: 1 }}>{t('dailySongReminder')}</Body>
              <Switch
                value={settings.dailyReminder}
                onValueChange={(v) => toggle('dailyReminder', v)}
                trackColor={{ true: C.primary, false: C.border }}
              />
            </View>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Body>{t('ritualReminders')}</Body>
                <Small>{t('ritualRemindersSub')}</Small>
              </View>
              <Switch
                value={settings.ritualReminders}
                onValueChange={(v) => toggle('ritualReminders', v)}
                trackColor={{ true: C.primary, false: C.border }}
              />
            </View>
            {denied && <Small style={{ color: C.primary }}>{t('permissionDenied')}</Small>}
          </>
        ) : (
          <Body muted>{t('remindersWebOnly')}</Body>
        )}
      </Card>

      <Card>
        <Pressable accessibilityRole="button" onPress={share}>
          <Text style={styles.link}>↗ {t('share')}</Text>
        </Pressable>
      </Card>

      <Card>
        <H2>{t('about')}</H2>
        <Body muted>{t('aboutText')}</Body>
        <H2 style={{ marginTop: S.sm }}>{t('privacy')}</H2>
        <Body muted>{t('privacyText')}</Body>
        <Small style={{ marginTop: S.sm }}>
          {t('version')} {APP_VERSION}
        </Small>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', gap: S.sm },
  segBtn: { flex: 1, paddingVertical: S.md, borderRadius: R.md, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center' },
  segOn: { backgroundColor: C.primary },
  segText: { fontWeight: '800', color: C.primary, fontSize: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  link: { color: C.primary, fontWeight: '800', fontSize: 16 },
});

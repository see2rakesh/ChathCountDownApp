import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, S } from '@/components/theme';
import { Body, Button, Card, H2, Screen, Small } from '@/components/ui';
import {
  FACEBOOK_HOME,
  INSTAGRAM_CAMERA,
  isWhatsAppCallLink,
  isWhatsAppGroupLink,
  NEW_MEET,
  useLiveLinks,
  whatsAppMessage,
  YOUTUBE_LIVE_SEARCH,
} from '@/lib/live';
import { useSettings } from '@/lib/settings';
import { openApp, openLink } from '@/lib/share';

export default function LiveScreen() {
  const { settings, t } = useSettings();
  const lang = settings.lang;
  const ghatLinks = useLiveLinks();

  return (
    <Screen>
      <FamilyCallCard />

      <Card>
        <H2>🎥 {t('goLive')}</H2>
        <AppButton label={t('liveInstagram')} hint={t('liveInstagramHint')} icon="logo-instagram" onPress={() => openApp(INSTAGRAM_CAMERA)} />
        <AppButton label={t('liveFacebook')} hint={t('liveFacebookHint')} icon="logo-facebook" onPress={() => openApp(FACEBOOK_HOME)} />
        <Button label={t('tellFamily')} variant="outline" onPress={() => openApp(whatsAppMessage(t('tellFamilyMessage')))} />
      </Card>

      <Card>
        <H2>🌅 {t('ghatLive')}</H2>
        <Body muted>{t('ghatLiveSub')}</Body>
        {ghatLinks.map((l) => (
          <Pressable key={l.url} accessibilityRole="link" onPress={() => openLink(l.url)} style={styles.ghatRow}>
            <Ionicons name="radio-outline" size={22} color={C.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.ghatTitle}>{l.title[lang]}</Text>
              <Small>{l.source}</Small>
            </View>
            <Ionicons name="open-outline" size={18} color={C.muted} />
          </Pressable>
        ))}
        <Button label={`▶ ${t('searchLive')}`} variant="outline" onPress={() => openLink(YOUTUBE_LIVE_SEARCH)} />
        {ghatLinks.length === 0 && <Small>{t('ghatLiveEmpty')}</Small>}
      </Card>

      <Small>ⓘ {t('liveNote')}</Small>
    </Screen>
  );
}

function FamilyCallCard() {
  const { settings, update, t } = useSettings();
  const pinned = settings.familyGroupLink;
  const [showPin, setShowPin] = useState(false);
  const [pasteError, setPasteError] = useState(false);

  const paste = async () => {
    const text = (await Clipboard.getStringAsync().catch(() => '')).trim();
    // An invite is often copied with WhatsApp's own text around it, so pick out the link.
    const link = text.match(/https:\/\/(chat|call)\.whatsapp\.com\/\S+/)?.[0] ?? '';
    if (!isWhatsAppGroupLink(link)) return setPasteError(true);
    setPasteError(false);
    setShowPin(false);
    update({ familyGroupLink: link });
  };

  return (
    <Card>
      <H2>📞 {t('familyCall')}</H2>
      {pinned ? (
        <>
          <Button label={isWhatsAppCallLink(pinned) ? t('joinFamilyCall') : t('openFamilyGroup')} onPress={() => openLink(pinned)} />
          {!isWhatsAppCallLink(pinned) && <Small>{t('groupHint')}</Small>}
          <View style={styles.pinnedRow}>
            <Small style={{ flex: 1 }}>📌 {t('pinned')}</Small>
            <Pressable accessibilityRole="button" onPress={() => update({ familyGroupLink: '' })} hitSlop={8}>
              <Text style={styles.linkText}>{t('unpin')}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Button label={t('callOnWhatsApp')} onPress={() => openApp(whatsAppMessage(t('callMessage')))} />
          <Small>{t('callSteps')}</Small>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: showPin }} onPress={() => setShowPin((v) => !v)} hitSlop={6}>
            <Text style={styles.linkText}>
              {t('pinGroup')} {showPin ? '▴' : '▾'}
            </Text>
          </Pressable>
          {showPin && (
            <View style={styles.pinBox}>
              <Small>{t('pinGroupHow')}</Small>
              <Button label={`📋 ${t('paste')}`} variant="outline" onPress={paste} style={styles.small} />
              {pasteError && <Small style={{ color: C.primary }}>{t('notWhatsAppLink')}</Small>}
            </View>
          )}
        </>
      )}
      <Pressable accessibilityRole="link" onPress={() => openLink(NEW_MEET)} hitSlop={6}>
        <Text style={[styles.linkText, { color: C.muted }]}>{t('useMeet')} →</Text>
      </Pressable>
    </Card>
  );
}

function AppButton({ label, hint, icon, onPress }: { label: string; hint: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.appBtn, pressed && { opacity: 0.75 }]}>
      <Ionicons name={icon} size={26} color={C.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.appLabel}>{label}</Text>
        <Small>{hint}</Small>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  small: { paddingVertical: S.xs, paddingHorizontal: S.lg, alignSelf: 'flex-start' },
  pinnedRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  pinBox: { gap: S.sm, padding: S.md, backgroundColor: C.surfaceWarm, borderRadius: 12 },
  linkText: { color: C.primary, fontWeight: '700' },
  appBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    padding: S.md,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    backgroundColor: C.bg,
  },
  appLabel: { fontSize: 16, fontWeight: '800', color: C.text },
  ghatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    paddingVertical: S.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  ghatTitle: { fontSize: 15, fontWeight: '700', color: C.text },
});

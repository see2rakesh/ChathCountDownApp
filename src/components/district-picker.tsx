import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { StringKey } from '@/lib/i18n';
import { locateDistrict, type LocateResult } from '@/lib/location';
import { useSettings } from '@/lib/settings';
import { countryOf, COUNTRIES, DISTRICTS, getCountry, getDistrict, getState, STATES, type District } from '@/lib/sun';
import { C, MAX_W, R, S } from './theme';
import { Chip } from './ui';

/** Picker steps: Country → State → District/City. Search jumps straight to any place. */
type Step = 'country' | 'state' | 'place';

/** Countries with one region or only a few places skip the state step. */
const isSmall = (countryId: string) =>
  STATES.filter((s) => s.country === countryId).length <= 1 || DISTRICTS.filter((d) => countryOf(d) === countryId).length <= 15;

/** India and Nepal first, then the rest alphabetically. */
const PINNED = ['in', 'np'];

interface Row {
  id: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  chevron?: boolean;
  onPress: () => void;
}

export function DistrictPicker() {
  const { settings, update, t } = useSettings();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [step, setStep] = useState<Step>('place');
  const [countryId, setCountryId] = useState('in');
  /** Empty when a small country lists all its places at once. */
  const [stateId, setStateId] = useState('');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<Exclude<LocateResult, { ok: true }>['reason'] | null>(null);
  const insets = useSafeAreaInsets();
  const lang = settings.lang;
  const current = getDistrict(settings.districtId);
  const browsingCountry = getCountry(countryId) ?? COUNTRIES[0];
  const browsingState = getState(stateId);
  const small = isSmall(countryId);

  const show = () => {
    const cid = countryOf(current);
    setCountryId(cid);
    setStateId(isSmall(cid) ? '' : current.state);
    setStep('place');
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setQ('');
    setLocError(null);
  };

  const choose = (id: string) => {
    update({ districtId: id, districtAuto: false });
    close();
  };

  const useMyLocation = async () => {
    setLocating(true);
    setLocError(null);
    const r = await locateDistrict(true);
    setLocating(false);
    if (!r.ok) return setLocError(r.reason);
    update({ districtId: r.district.id, districtAuto: true, locationAsked: true });
    close();
  };

  const errorKey: Record<NonNullable<typeof locError>, StringKey> = {
    denied: 'locationDenied',
    outside: 'locationOutside',
    error: 'locationError',
  };

  const rows = ((): Row[] => {
    const byName = <T extends { en: string; hi: string }>(a: T, b: T) => a[lang].localeCompare(b[lang]);
    const isCurrent = (id: string) => !settings.districtAuto && id === settings.districtId;
    const placeRow = (d: District, withRegion: boolean): Row => ({
      id: d.id,
      title: d[lang],
      subtitle:
        [
          d.kind === 'city' && countryOf(d) === 'in' ? t('city') : '',
          withRegion ? getState(d.state)?.[lang] : '',
          withRegion && countryOf(d) !== 'in' ? getCountry(countryOf(d))?.[lang] : '',
        ]
          .filter(Boolean)
          .join(' · ') || undefined,
      selected: isCurrent(d.id),
      onPress: () => choose(d.id),
    });

    const s = q.trim().toLowerCase();
    if (s) {
      return DISTRICTS.filter((d) => d.en.toLowerCase().includes(s) || d.hi.includes(s))
        .sort(byName)
        .slice(0, 60)
        .map((d) => placeRow(d, true));
    }
    if (step === 'country') {
      const pinned = PINNED.map((id) => COUNTRIES.find((c) => c.id === id)!);
      const rest = COUNTRIES.filter((c) => !PINNED.includes(c.id)).sort(byName);
      return [...pinned, ...rest].map((c) => ({
        id: c.id,
        title: c[lang],
        selected: c.id === countryOf(current),
        chevron: true,
        onPress: () => {
          setCountryId(c.id);
          if (isSmall(c.id)) {
            setStateId('');
            setStep('place');
          } else setStep('state');
        },
      }));
    }
    if (step === 'state') {
      const hasDistricts = countryId === 'in' || countryId === 'np';
      return STATES.filter((st) => st.country === countryId).sort(byName).map((st) => ({
        id: st.id,
        title: st[lang],
        subtitle: `${DISTRICTS.filter((d) => d.state === st.id && (!hasDistricts || d.kind === 'district')).length} ${t(hasDistricts ? 'districtsCount' : 'citiesCount')}`,
        selected: st.id === current.state,
        chevron: true,
        onPress: () => {
          setStateId(st.id);
          setStep('place');
        },
      }));
    }
    // Districts first, then separately listed cities.
    const inState = DISTRICTS.filter((d) => (stateId ? d.state === stateId : countryOf(d) === countryId));
    return [...inState.filter((d) => d.kind === 'district').sort(byName), ...inState.filter((d) => d.kind === 'city').sort(byName)].map((d) =>
      placeRow(d, false),
    );
  })();

  return (
    <>
      <Chip label={settings.districtAuto ? `${current[lang]} · ${t('auto')}` : current[lang]} onPress={show} />
      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + S.md }]}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('chooseDistrict')}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} hitSlop={12}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={useMyLocation}
              disabled={locating}
              style={({ pressed }) => [styles.locate, settings.districtAuto && styles.locateOn, pressed && { opacity: 0.7 }]}>
              {locating ? <ActivityIndicator color={C.primary} /> : <Ionicons name="locate" size={20} color={C.primary} />}
              <Text style={styles.locateText}>{locating ? t('locating') : t('useMyLocation')}</Text>
              {settings.districtAuto && !locating && <Text style={{ color: C.primary }}>✓</Text>}
            </Pressable>
            {locError && (
              <View style={{ gap: S.xs }}>
                <Text style={styles.locError}>{t(errorKey[locError])}</Text>
                {locError === 'denied' && Platform.OS !== 'web' && (
                  <Pressable accessibilityRole="button" onPress={() => Linking.openSettings().catch(() => {})} hitSlop={6}>
                    <Text style={styles.locLink}>{t('openPhoneSettings')} →</Text>
                  </Pressable>
                )}
              </View>
            )}

            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t('search')}
              placeholderTextColor={C.muted}
              style={styles.input}
              autoCorrect={false}
            />

            {!q.trim() && (
              <View style={styles.crumbs}>
                <Pressable accessibilityRole="button" onPress={() => setStep('country')} hitSlop={6}>
                  <Text style={[styles.crumb, step === 'country' && styles.crumbOn]}>{step === 'country' ? t('country') : browsingCountry[lang]}</Text>
                </Pressable>
                {step !== 'country' && !small && (
                  <>
                    <Text style={styles.crumbSep}>›</Text>
                    <Pressable accessibilityRole="button" onPress={() => setStep('state')} hitSlop={6}>
                      <Text style={[styles.crumb, step === 'state' && styles.crumbOn]}>
                        {step === 'place' && browsingState ? browsingState[lang] : t('state')}
                      </Text>
                    </Pressable>
                  </>
                )}
                {step === 'place' && (
                  <>
                    <Text style={styles.crumbSep}>›</Text>
                    <Text style={[styles.crumb, styles.crumbOn]}>{countryId === 'in' || countryId === 'np' ? t('districtOrCity') : t('city')}</Text>
                  </>
                )}
              </View>
            )}

            <FlatList
              data={rows}
              keyExtractor={(r) => r.id}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={step === 'country' && !q.trim() ? <Text style={styles.footNote}>{t('countryMissing')}</Text> : null}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={item.onPress}
                  style={({ pressed }) => [styles.row, item.selected && styles.rowSelected, pressed && { opacity: 0.7 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowText, item.selected && { color: C.primary, fontWeight: '800' }]}>{item.title}</Text>
                    {item.subtitle && <Text style={styles.rowSub}>{item.subtitle}</Text>}
                  </View>
                  {item.chevron ? (
                    <Ionicons name="chevron-forward" size={18} color={C.muted} />
                  ) : (
                    item.selected && <Text style={{ color: C.primary }}>✓</Text>
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(40,20,5,0.45)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: {
    width: '100%',
    maxWidth: MAX_W,
    height: '85%',
    backgroundColor: C.bg,
    borderTopLeftRadius: R.lg,
    borderTopRightRadius: R.lg,
    paddingHorizontal: S.lg,
    paddingTop: S.lg,
    gap: S.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: C.text },
  close: { fontSize: 20, color: C.muted },
  input: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingVertical: S.md,
    fontSize: 16,
    color: C.text,
  },
  crumbs: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: S.xs },
  crumb: { fontSize: 14, fontWeight: '700', color: C.primary, textDecorationLine: 'underline' },
  crumbOn: { color: C.text, textDecorationLine: 'none' },
  crumbSep: { fontSize: 14, color: C.muted },
  row: {
    paddingVertical: S.md,
    paddingHorizontal: S.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  rowSelected: { backgroundColor: C.surfaceWarm },
  rowText: { fontSize: 16, color: C.text },
  rowSub: { fontSize: 12, color: C.muted, marginTop: 1 },
  footNote: { fontSize: 13, color: C.muted, padding: S.md, textAlign: 'center' },
  locate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    padding: S.md,
    borderRadius: R.md,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: C.surface,
  },
  locateOn: { backgroundColor: C.surfaceWarm },
  locateText: { flex: 1, fontSize: 16, fontWeight: '700', color: C.primary },
  locError: { fontSize: 13, lineHeight: 18, color: C.primaryDark },
  locLink: { fontSize: 13, fontWeight: '700', color: C.primary },
});

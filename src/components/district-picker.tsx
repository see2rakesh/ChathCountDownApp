import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DISTRICTS } from '@/lib/sun';
import { useSettings } from '@/lib/settings';
import { C, MAX_W, R, S } from './theme';
import { Chip } from './ui';

export function DistrictPicker() {
  const { settings, update, t } = useSettings();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const insets = useSafeAreaInsets();
  const lang = settings.lang;
  const current = DISTRICTS.find((d) => d.id === settings.districtId) ?? DISTRICTS[0];

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const sorted = [...DISTRICTS].sort((a, b) => a[lang].localeCompare(b[lang]));
    if (!s) return sorted;
    return sorted.filter((d) => d.en.toLowerCase().includes(s) || d.hi.includes(s));
  }, [q, lang]);

  return (
    <>
      <Chip label={current[lang]} onPress={() => setOpen(true)} />
      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + S.md }]}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('chooseDistrict')}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setOpen(false)} hitSlop={12}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t('search')}
              placeholderTextColor={C.muted}
              style={styles.input}
              autoCorrect={false}
            />
            <FlatList
              data={list}
              keyExtractor={(d) => d.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = item.id === settings.districtId;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      update({ districtId: item.id });
                      setOpen(false);
                      setQ('');
                    }}
                    style={({ pressed }) => [styles.row, selected && styles.rowSelected, pressed && { opacity: 0.7 }]}>
                    <Text style={[styles.rowText, selected && { color: C.primary, fontWeight: '800' }]}>{item[lang]}</Text>
                    {selected && <Text style={{ color: C.primary }}>✓</Text>}
                  </Pressable>
                );
              }}
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
    height: '80%',
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
  row: {
    paddingVertical: S.md,
    paddingHorizontal: S.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSelected: { backgroundColor: C.surfaceWarm },
  rowText: { fontSize: 16, color: C.text },
});

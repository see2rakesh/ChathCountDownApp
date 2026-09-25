import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, R, S } from '@/components/theme';
import { Body, Button, Card, H1, Screen, Small } from '@/components/ui';
import { SAMAGRI } from '@/data/festival';
import { useSettings } from '@/lib/settings';

export default function SamagriScreen() {
  const { settings, update, t } = useSettings();
  const lang = settings.lang;
  const checked = new Set(settings.checklist);
  const done = SAMAGRI.filter((i) => checked.has(i.id)).length;

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update({ checklist: [...next] });
  };

  return (
    <Screen>
      <View style={{ gap: 2 }}>
        <H1>{t('samagriTitle')}</H1>
        <Body muted>{t('samagriSub')}</Body>
      </View>
      <Card>
        <View style={styles.progressHead}>
          <Text style={styles.count}>
            {done}/{SAMAGRI.length}
          </Text>
          {done > 0 && <Button label={t('reset')} variant="outline" onPress={() => update({ checklist: [] })} style={styles.reset} />}
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(done / SAMAGRI.length) * 100}%` }]} />
        </View>
      </Card>
      <Card style={{ paddingVertical: S.xs }}>
        {SAMAGRI.map((item, i) => {
          const on = checked.has(item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => toggle(item.id)}
              style={[styles.row, i === SAMAGRI.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.box, on && styles.boxOn]}>{on && <Text style={styles.tick}>✓</Text>}</View>
              <Text style={[styles.label, on && styles.labelOn]}>{item.name[lang]}</Text>
            </Pressable>
          );
        })}
      </Card>
      <Small>ⓘ {t('aboutText')}</Small>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontSize: 28, fontWeight: '900', color: C.primary },
  reset: { paddingVertical: S.xs, paddingHorizontal: S.lg },
  track: { height: 10, backgroundColor: C.surfaceWarm, borderRadius: R.pill, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    paddingVertical: S.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  box: { width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: C.primary },
  tick: { color: '#fff', fontWeight: '900' },
  label: { flex: 1, fontSize: 16, color: C.text },
  labelOn: { color: C.muted, textDecorationLine: 'line-through' },
});

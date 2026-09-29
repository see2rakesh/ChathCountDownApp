import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { C, R, S } from '@/components/theme';
import { Body, Card, H2, Screen, Small } from '@/components/ui';
import { KATHA_INTRO, KATHA_NOTE, KATHA_SECTIONS, LEGENDS, LEGENDS_TITLE } from '@/data/katha';
import { useSettings } from '@/lib/settings';

export default function KathaScreen() {
  const { settings } = useSettings();
  const lang = settings.lang;
  const [first, ...rest] = KATHA_SECTIONS;

  return (
    <Screen>
      <LinearGradient colors={[C.heroFrom, C.heroTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroText}>{KATHA_INTRO[lang]}</Text>
      </LinearGradient>

      <Section icon={first.icon} title={first.title[lang]} paras={first.paras.map((p) => p[lang])} />

      <H2 style={{ marginTop: S.sm }}>📖 {LEGENDS_TITLE[lang]}</H2>
      {LEGENDS.map((l) => (
        <Card key={l.id}>
          <Text style={styles.legendTitle}>{l.title[lang]}</Text>
          <Small style={styles.source}>{l.source[lang]}</Small>
          <Body>{l.text[lang]}</Body>
        </Card>
      ))}

      {rest.map((s) => (
        <Section key={s.id} icon={s.icon} title={s.title[lang]} paras={s.paras.map((p) => p[lang])} />
      ))}

      <Small>ⓘ {KATHA_NOTE[lang]}</Small>
    </Screen>
  );
}

function Section({ icon, title, paras }: { icon: string; title: string; paras: string[] }) {
  return (
    <Card>
      <H2>
        {icon} {title}
      </H2>
      <View style={{ gap: S.sm }}>
        {paras.map((p, i) => (
          <Body key={i}>{p}</Body>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: R.lg, padding: S.xl },
  heroText: { color: '#fff', fontSize: 17, lineHeight: 25, fontWeight: '700' },
  legendTitle: { fontSize: 17, fontWeight: '800', color: C.primaryDark },
  source: { fontStyle: 'italic', marginTop: -S.xs },
});

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { C, S } from '@/components/theme';
import { Body, Button, Card, H2, Screen, Small } from '@/components/ui';
import { SINGERS } from '@/data/festival';
import { useSettings } from '@/lib/settings';

const BIO = {
  en: [
    'Sharda Sinha was the voice of Chhath. For generations of families in Bihar and across the world, the festival does not begin until her songs play at the ghat.',
    'She sang in Maithili, Bhojpuri and Hindi, and recorded 62 Chhath songs across nine albums. Songs like "Kelwa Ke Paat Par", "Ho Dinanath" and "Pahile Pahil Chhathi Maiya" became part of the ritual itself.',
    'She was honoured with the Padma Shri (1991), the Sangeet Natak Akademi Award (2000), the Padma Bhushan (2018) and, posthumously, the Padma Vibhushan (2025).',
    'She passed away on 5 November 2024, during Chhath, at the age of 72. Her last Chhath song, "Dukhwa Mitayin Chhathi Maiya", was released that same season.',
  ],
  hi: [
    'शारदा सिन्हा छठ की आवाज़ थीं। बिहार और दुनिया भर के परिवारों के लिए, जब तक घाट पर उनके गीत न बजें, छठ शुरू ही नहीं होता।',
    'उन्होंने मैथिली, भोजपुरी और हिंदी में गाया और नौ एल्बमों में 62 छठ गीत रिकॉर्ड किए। "केलवा के पात पर", "हो दीनानाथ" और "पहिले पहिल छठी मईया" जैसे गीत अनुष्ठान का हिस्सा बन गए।',
    'उन्हें पद्म श्री (1991), संगीत नाटक अकादमी पुरस्कार (2000), पद्म भूषण (2018) और मरणोपरांत पद्म विभूषण (2025) से सम्मानित किया गया।',
    '5 नवंबर 2024 को, छठ के दौरान ही, 72 वर्ष की आयु में उनका निधन हुआ। उनका अंतिम छठ गीत "दुखवा मिटाईं छठी मैया" उसी वर्ष आया था।',
  ],
};

export default function TributeScreen() {
  const { settings, t } = useSettings();
  const lang = settings.lang;
  const router = useRouter();

  return (
    <Screen>
      <LinearGradient colors={[C.primaryDark, C.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.medal}>
          <Text style={styles.medalText}>🪔</Text>
        </View>
        <Text style={styles.name}>{t('tributeTitle')}</Text>
        <Text style={styles.sub}>{t('tributeSub')}</Text>
      </LinearGradient>

      <Card>
        {BIO[lang].map((p, i) => (
          <Body key={i}>{p}</Body>
        ))}
        <Button label={`🎵 ${t('todaysGeet')}`} onPress={() => router.push('/geet')} style={{ marginTop: S.sm }} />
      </Card>

      <H2>{t('alsoLoved')}</H2>
      {SINGERS.map((s) => (
        <Card key={s.name.en}>
          <Text style={styles.singer}>{s.name[lang]}</Text>
          <Small>{s.note[lang]}</Small>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 20, padding: S.xl, alignItems: 'center', gap: S.xs },
  medal: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: S.sm,
  },
  medalText: { fontSize: 44 },
  name: { color: '#fff', fontSize: 30, fontWeight: '900' },
  sub: { color: '#FFE3B8', fontSize: 15, fontWeight: '700' },
  singer: { fontSize: 16, fontWeight: '800', color: C.text },
});

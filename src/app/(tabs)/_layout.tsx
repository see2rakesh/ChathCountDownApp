import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import Tabs from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { C, S } from '@/components/theme';
import { useSettings } from '@/lib/settings';

type IconName = keyof typeof Ionicons.glyphMap;

function HeaderRight() {
  const { settings, update } = useSettings();
  return (
    <View style={styles.headerRight}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Switch language"
        onPress={() => update({ lang: settings.lang === 'hi' ? 'en' : 'hi' })}
        style={styles.langBtn}
        hitSlop={8}>
        <Text style={styles.langText}>{settings.lang === 'hi' ? 'EN' : 'हि'}</Text>
      </Pressable>
      <Link href="/settings" asChild>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" hitSlop={8}>
          <Ionicons name="settings-outline" size={24} color={C.primaryDark} />
        </Pressable>
      </Link>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useSettings();
  const icon = (name: IconName) =>
    function TabIcon({ color, size }: { color: ColorValue; size: number }) {
      return <Ionicons name={name} color={color as string} size={size} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: C.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '800', color: C.primaryDark },
        headerRight: () => <HeaderRight />,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: '#FFFDF8', borderTopColor: C.border },
        tabBarLabelStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: C.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: t('tabHome'), headerTitle: t('appName'), tabBarIcon: icon('sunny-outline') }} />
      <Tabs.Screen name="anushthan" options={{ title: t('tabRituals'), tabBarIcon: icon('calendar-outline') }} />
      <Tabs.Screen name="geet" options={{ title: t('tabGeet'), tabBarIcon: icon('musical-notes-outline') }} />
      <Tabs.Screen name="vidhi" options={{ title: t('tabVidhi'), tabBarIcon: icon('checkbox-outline') }} />
      <Tabs.Screen name="tribute" options={{ title: t('tabTribute'), tabBarIcon: icon('flower-outline') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: S.lg, marginRight: S.lg },
  langBtn: { borderWidth: 1.5, borderColor: C.primaryDark, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 2 },
  langText: { color: C.primaryDark, fontWeight: '800', fontSize: 14 },
});

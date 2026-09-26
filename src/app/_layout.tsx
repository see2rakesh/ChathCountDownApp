import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { C } from '@/components/theme';
import { locateDistrict } from '@/lib/location';
import { rescheduleAll } from '@/lib/notifications';
import { SettingsProvider, useSettings } from '@/lib/settings';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ReminderSync() {
  const { settings, loaded } = useSettings();
  const { lang, districtId, dailyReminder, ritualReminders } = settings;
  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync().catch(() => {});
    rescheduleAll({ lang, districtId, dailyReminder, ritualReminders }).catch(() => {});
  }, [loaded, lang, districtId, dailyReminder, ritualReminders]);
  return null;
}

/** In auto mode, picks the district nearest the phone once per launch (asking for permission only the first time). */
function LocationSync() {
  const { settings, loaded, update } = useSettings();
  useEffect(() => {
    // Browsers only allow the prompt after a tap, so the web app uses the picker's "Use my location" button instead.
    if (!loaded || !settings.districtAuto || Platform.OS === 'web') return;
    locateDistrict(!settings.locationAsked).then((r) =>
      update((prev) => {
        if (!prev.districtAuto) return { locationAsked: true }; // user picked by hand meanwhile
        if (r.ok) return { locationAsked: true, districtId: r.district.id };
        // Denied or far from every listed place: stay on the current district and stop claiming "auto". Errors retry next launch.
        return { locationAsked: true, districtAuto: r.reason === 'error' };
      }),
    );
  }, [loaded]);
  return null;
}

function CloseButton() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={12}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
      <Text style={{ fontSize: 22, color: C.primaryDark, paddingHorizontal: 8 }}>✕</Text>
    </Pressable>
  );
}

function RootStack() {
  const { t, loaded } = useSettings();
  // Wait for saved settings (language, district) before rendering. This also keeps the
  // statically rendered web HTML identical to the first client render (no hydration mismatch).
  if (!loaded) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.bg },
        headerTintColor: C.primaryDark,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: C.bg },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: t('settings'), presentation: 'modal', headerRight: () => <CloseButton /> }} />
      <Stack.Screen name="profile" options={{ title: t('profile'), presentation: 'modal', headerRight: () => <CloseButton /> }} />
      <Stack.Screen name="live" options={{ title: t('live') }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <StatusBar style="dark" />
      <ReminderSync />
      <LocationSync />
      <RootStack />
    </SettingsProvider>
  );
}

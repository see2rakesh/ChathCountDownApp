import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { C, R, S } from '@/components/theme';
import { Body, Button, Card, H2, Screen, Small } from '@/components/ui';
import { DEFAULT_SOOPS, useProfiles } from '@/lib/profile';
import { useSettings } from '@/lib/settings';

export default function ProfileScreen() {
  const { t } = useSettings();
  const router = useRouter();
  const { profiles, active, create, edit, login, logout, remove } = useProfiles();
  const others = profiles.filter((p) => p.id !== active?.id);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/vidhi'));

  const confirmDelete = (id: string) => {
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(t('deleteConfirm'))) remove(id);
      return;
    }
    Alert.alert(t('deleteProfile'), t('deleteConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('deleteProfile'), style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  return (
    <Screen>
      {active && (
        <Card>
          <Small>{t('loggedInAs')}</Small>
          <ProfileForm
            key={active.id}
            initialName={active.name}
            initialSoops={active.soops}
            submitLabel={t('save')}
            onSubmit={(name, soops) => {
              edit({ name: name.trim(), soops });
              close();
            }}
          />
          <View style={styles.btnRow}>
            <Button label={t('logout')} variant="outline" onPress={logout} style={styles.small} />
            <Pressable accessibilityRole="button" onPress={() => confirmDelete(active.id)} hitSlop={8}>
              <Text style={styles.danger}>{t('deleteProfile')}</Text>
            </Pressable>
          </View>
        </Card>
      )}

      {others.length > 0 && (
        <Card>
          <H2>{t('savedProfiles')}</H2>
          {others.map((p) => (
            <View key={p.id} style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p.name.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {p.name}
                </Text>
                <Small>
                  {p.soops} {t('soops')}
                </Small>
              </View>
              <Button
                label={t('login')}
                onPress={() => {
                  login(p.id);
                  close();
                }}
                style={styles.small}
              />
              <Pressable accessibilityRole="button" accessibilityLabel={`${t('deleteProfile')}: ${p.name}`} onPress={() => confirmDelete(p.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color={C.muted} />
              </Pressable>
            </View>
          ))}
        </Card>
      )}

      <Card>
        <H2>{active || others.length > 0 ? t('newProfile') : t('createProfile')}</H2>
        <ProfileForm
          initialName=""
          initialSoops={DEFAULT_SOOPS}
          submitLabel={t('createProfile')}
          onSubmit={(name, soops) => {
            create(name, soops);
            close();
          }}
        />
      </Card>

      <Body muted>🔒 {t('profileLocalNote')}</Body>
    </Screen>
  );
}

function ProfileForm({
  initialName,
  initialSoops,
  submitLabel,
  onSubmit,
}: {
  initialName: string;
  initialSoops: number;
  submitLabel: string;
  onSubmit: (name: string, soops: number) => void;
}) {
  const { t } = useSettings();
  const [name, setName] = useState(initialName);
  const [soops, setSoops] = useState(initialSoops);
  const valid = name.trim().length > 0;

  return (
    <View style={{ gap: S.sm }}>
      <Small>{t('yourName')}</Small>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('yourName')}
        placeholderTextColor={C.muted}
        maxLength={30}
        style={styles.input}
      />
      <Small>{t('howManySoops')}</Small>
      <View style={styles.stepper}>
        <Pressable accessibilityRole="button" accessibilityLabel="−" onPress={() => setSoops((n) => Math.max(1, n - 1))} style={styles.stepBtn}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{soops}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="+" onPress={() => setSoops((n) => Math.min(51, n + 1))} style={styles.stepBtn}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
      <Button label={submitLabel} onPress={() => valid && onSubmit(name, soops)} style={{ opacity: valid ? 1 : 0.5, marginTop: S.xs }} />
    </View>
  );
}

const styles = StyleSheet.create({
  small: { paddingVertical: S.xs, paddingHorizontal: S.lg },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: S.sm },
  danger: { color: '#B42318', fontWeight: '700' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.xs },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  name: { fontSize: 16, fontWeight: '700', color: C.text },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    fontSize: 16,
    color: C.text,
    backgroundColor: C.bg,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: S.lg },
  stepBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 22, fontWeight: '800', color: C.primary },
  stepValue: { fontSize: 22, fontWeight: '900', color: C.text, minWidth: 32, textAlign: 'center' },
});

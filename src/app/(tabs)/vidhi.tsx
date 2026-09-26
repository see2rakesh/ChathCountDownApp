import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { C, R, S } from '@/components/theme';
import { Body, Button, Card, H1, H2, Screen, Small } from '@/components/ui';
import { SHOPS, type ShopId } from '@/data/festival';
import { useChecklist, useProfiles } from '@/lib/profile';
import { useSettings } from '@/lib/settings';
import { shareOnWhatsApp } from '@/lib/share';

export default function SamagriScreen() {
  const { settings, t } = useSettings();
  const lang = settings.lang;
  const list = useChecklist(lang);
  const [hideBought, setHideBought] = useState(false);

  const shareRemaining = () => {
    const sections = list.groups
      .map((g) => {
        const left = g.items.filter((i) => !list.isChecked(i.id));
        if (left.length === 0) return '';
        const lines = left.map((i) => `• ${i.label}${i.count ? ` × ${i.count}` : ''}`).join('\n');
        return `${g.shop.icon} ${g.shop.name[lang]}\n${lines}`;
      })
      .filter(Boolean);
    shareOnWhatsApp(`🪔 ${t('stillToBuy')}\n\n${sections.join('\n\n')}`);
  };

  return (
    <Screen>
      <View style={{ gap: 2 }}>
        <H1>{t('samagriTitle')}</H1>
        <Body muted>{t('samagriSub')}</Body>
      </View>

      {list.active && <ProfileBanner />}

      <Card>
        <View style={styles.progressHead}>
          <Text style={styles.count}>
            {list.done}/{list.total}
          </Text>
          {list.done > 0 && <Button label={t('reset')} variant="outline" onPress={list.reset} style={styles.small} />}
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${list.total ? (list.done / list.total) * 100 : 0}%` }]} />
        </View>
        {list.total > 0 && list.done === list.total && <Body style={{ color: C.success, fontWeight: '700' }}>{t('allBought')}</Body>}
        <View style={styles.switchRow}>
          <Body style={{ flex: 1 }}>{t('howManySoops')}</Body>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="−"
            onPress={() => list.setSoops(Math.max(1, list.soops - 1))}
            hitSlop={6}
            style={styles.stepBtn}>
            <Text style={styles.stepText}>−</Text>
          </Pressable>
          <Text style={styles.stepValue}>{list.soops}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="+"
            onPress={() => list.setSoops(Math.min(51, list.soops + 1))}
            hitSlop={6}
            style={styles.stepBtn}>
            <Text style={styles.stepText}>+</Text>
          </Pressable>
        </View>
        <View style={styles.switchRow}>
          <Body style={{ flex: 1 }}>{t('hideBought')}</Body>
          <Switch value={hideBought} onValueChange={setHideBought} trackColor={{ true: C.primary, false: C.border }} />
        </View>
      </Card>

      {list.groups.map(({ shop, items }) => {
        const shown = hideBought ? items.filter((i) => !list.isChecked(i.id)) : items;
        const bought = items.filter((i) => list.isChecked(i.id)).length;
        return (
          <Card key={shop.id} style={{ paddingBottom: S.xs }}>
            <View style={styles.shopHead}>
              <H2 style={{ flex: 1 }}>
                {shop.icon} {shop.name[lang]}
              </H2>
              <Text style={[styles.shopCount, bought === items.length && { color: C.success }]}>
                {bought}/{items.length}
              </Text>
            </View>
            {shown.map((item, i) => {
              const on = list.isChecked(item.id);
              return (
                <View key={item.id} style={[styles.row, i === shown.length - 1 && { borderBottomWidth: 0 }]}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    onPress={() => list.toggle(item.id)}
                    style={styles.rowMain}>
                    <View style={[styles.box, on && styles.boxOn]}>{on && <Text style={styles.tick}>✓</Text>}</View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.label, on && styles.labelOn]}>{item.label}</Text>
                      {item.count !== undefined && (
                        <Small>
                          × {item.count} ({t('perSoop')})
                        </Small>
                      )}
                    </View>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${t('removeItem')}: ${item.label}`}
                    onPress={() => list.removeItem(item)}
                    hitSlop={8}>
                    <Ionicons name="close-circle-outline" size={22} color={C.muted} />
                  </Pressable>
                </View>
              );
            })}
          </Card>
        );
      })}

      <AddItemForm onAdd={list.addItem} />

      {list.hiddenCount > 0 && (
        <View style={styles.restoreRow}>
          <Small style={{ flex: 1 }}>
            {list.hiddenCount} {t('removedItems')}
          </Small>
          <Button label={t('restore')} variant="outline" onPress={list.restoreHidden} style={styles.small} />
        </View>
      )}

      {list.done < list.total && <Button label={`💬 ${t('shareList')}`} onPress={shareRemaining} />}

      {!list.active && <ProfileBanner />}

      <Small>ⓘ {t('aboutText')}</Small>
    </Screen>
  );
}

function ProfileBanner() {
  const { t } = useSettings();
  const router = useRouter();
  const { profiles, active, logout } = useProfiles();

  if (!active) {
    return (
      <Card style={styles.tip}>
        <View style={styles.tipHead}>
          <Ionicons name="people-outline" size={22} color={C.primaryDark} />
          <H2 style={{ flex: 1, color: C.primaryDark }}>{t('profileTipTitle')}</H2>
        </View>
        <Body>{t('profileTipText')}</Body>
        <View style={styles.btnRow}>
          <Button label={t('createProfile')} onPress={() => router.push('/profile')} style={styles.small} />
          {profiles.length > 0 && <Button label={t('login')} variant="outline" onPress={() => router.push('/profile')} style={styles.small} />}
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.profileCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{active.name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.profileName} numberOfLines={1}>
          {t('namaste')}, {active.name}
        </Text>
        <Small>{t('ownList')}</Small>
      </View>
      <Button label={t('editProfile')} variant="outline" onPress={() => router.push('/profile')} style={styles.small} />
      <Pressable accessibilityRole="button" accessibilityLabel={t('logout')} onPress={logout} hitSlop={8}>
        <Ionicons name="log-out-outline" size={24} color={C.primaryDark} />
      </Pressable>
    </Card>
  );
}

function AddItemForm({ onAdd }: { onAdd: (name: string, shop: ShopId) => void }) {
  const { settings, t } = useSettings();
  const [name, setName] = useState('');
  const [shop, setShop] = useState<ShopId>('mandi');

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name, shop);
    setName('');
  };

  return (
    <Card>
      <H2>＋ {t('addItem')}</H2>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('itemName')}
        placeholderTextColor={C.muted}
        onSubmitEditing={submit}
        returnKeyType="done"
        maxLength={60}
        style={styles.input}
      />
      <Small>{t('shop')}</Small>
      <View style={styles.chips}>
        {SHOPS.map((s) => {
          const on = s.id === shop;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setShop(s.id)}
              style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && { color: '#fff' }]}>
                {s.icon} {s.name[settings.lang]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Button label={t('add')} onPress={submit} style={{ opacity: name.trim() ? 1 : 0.5 }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  progressHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontSize: 28, fontWeight: '900', color: C.primary },
  small: { paddingVertical: S.xs, paddingHorizontal: S.lg },
  track: { height: 10, backgroundColor: C.surfaceWarm, borderRadius: R.pill, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.primary },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  shopHead: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  shopCount: { fontWeight: '800', color: C.muted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  box: { width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: C.primary },
  tick: { color: '#fff', fontWeight: '900' },
  label: { fontSize: 16, color: C.text },
  labelOn: { color: C.muted, textDecorationLine: 'line-through' },
  tip: { backgroundColor: C.surfaceWarm },
  tipHead: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  stepBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 18, fontWeight: '800', color: C.primary },
  stepValue: { fontSize: 18, fontWeight: '900', color: C.text, minWidth: 28, textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: S.sm, flexWrap: 'wrap', marginTop: S.xs },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  profileName: { fontSize: 16, fontWeight: '800', color: C.text },
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  chip: { borderWidth: 1, borderColor: C.border, borderRadius: R.pill, paddingVertical: S.xs, paddingHorizontal: S.md, backgroundColor: C.surface },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 13, fontWeight: '700', color: C.primaryDark },
  restoreRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
});

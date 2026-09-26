import { SAMAGRI, SHOPS, type ShopId } from '@/data/festival';
export { DEFAULT_SOOPS } from '@/data/festival';
import type { Lang } from './i18n';
import { useSettings } from './settings';

export interface CustomItem {
  id: string;
  name: string;
  shop: ShopId;
}

/** A local profile: a name plus a personal checklist. Stored only on this device (no account, no password). The guest list uses the same shape. */
export interface Profile {
  id: string;
  name: string;
  soops: number;
  checked: string[];
  /** Default items the user removed from their list. */
  hidden: string[];
  custom: CustomItem[];
}

export interface ChecklistItem {
  id: string;
  shop: ShopId;
  label: string;
  /** Quantity hint ("× 5") for items needed once per soop. */
  count?: number;
  custom: boolean;
}

const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function useProfiles() {
  const { settings, update } = useSettings();
  const active = settings.profiles.find((p) => p.id === settings.activeProfileId) ?? null;

  /** Creates a profile and logs it in. It starts as a copy of the guest list so nothing is lost. */
  const create = (name: string, soops: number) =>
    update((prev) => {
      const { checked, hidden, custom } = prev.guest;
      const profile: Profile = { id: newId('p'), name: name.trim(), soops, checked, hidden, custom };
      return { profiles: [...prev.profiles, profile], activeProfileId: profile.id };
    });

  const edit = (patch: Partial<Pick<Profile, 'name' | 'soops'>>) =>
    update((prev) => ({ profiles: prev.profiles.map((p) => (p.id === prev.activeProfileId ? { ...p, ...patch } : p)) }));

  const login = (id: string) => update({ activeProfileId: id });
  const logout = () => update({ activeProfileId: null });
  const remove = (id: string) =>
    update((prev) => ({
      profiles: prev.profiles.filter((p) => p.id !== id),
      activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId,
    }));

  return { profiles: settings.profiles, active, create, edit, login, logout, remove };
}

/** The checklist for whoever is logged in (or the guest list), grouped by shop. */
export function useChecklist(lang: Lang) {
  const { settings, update } = useSettings();
  const active = settings.profiles.find((p) => p.id === settings.activeProfileId) ?? null;
  const owner = active ?? settings.guest;

  const hidden = new Set(owner.hidden);
  const items: ChecklistItem[] = [
    ...SAMAGRI.filter((i) => !hidden.has(i.id)).map((i) => ({
      id: i.id,
      shop: i.shop,
      label: i.name[lang],
      count: i.perSoop ? owner.soops : undefined,
      custom: false,
    })),
    ...owner.custom.map((c) => ({ id: c.id, shop: c.shop, label: c.name, custom: true })),
  ];
  const checked = new Set(owner.checked);

  const groups = SHOPS.map((shop) => ({ shop, items: items.filter((i) => i.shop === shop.id) })).filter((g) => g.items.length > 0);

  /** Applies a change to the logged-in profile, or to the guest list when nobody is logged in. */
  const patch = (fn: (p: Profile) => Partial<Profile>) =>
    update((prev) =>
      prev.activeProfileId && prev.profiles.some((p) => p.id === prev.activeProfileId)
        ? { profiles: prev.profiles.map((p) => (p.id === prev.activeProfileId ? { ...p, ...fn(p) } : p)) }
        : { guest: { ...prev.guest, ...fn(prev.guest) } },
    );

  const toggle = (id: string) =>
    patch((p) => ({ checked: p.checked.includes(id) ? p.checked.filter((x) => x !== id) : [...p.checked, id] }));

  const removeItem = (item: ChecklistItem) =>
    patch((p) =>
      item.custom
        ? { custom: p.custom.filter((c) => c.id !== item.id), checked: p.checked.filter((x) => x !== item.id) }
        : { hidden: [...p.hidden, item.id] },
    );

  return {
    active,
    soops: owner.soops,
    groups,
    total: items.length,
    done: items.filter((i) => checked.has(i.id)).length,
    isChecked: (id: string) => checked.has(id),
    hiddenCount: hidden.size,
    toggle,
    reset: () => patch(() => ({ checked: [] })),
    removeItem,
    addItem: (name: string, shop: ShopId) => patch((p) => ({ custom: [...p.custom, { id: newId('c'), name: name.trim(), shop }] })),
    restoreHidden: () => patch(() => ({ hidden: [] })),
    setSoops: (soops: number) => patch(() => ({ soops })),
  };
}

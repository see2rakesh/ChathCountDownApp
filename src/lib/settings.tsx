import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { DEFAULT_SOOPS } from '@/data/festival';
import { translate, type Lang, type StringKey } from './i18n';
import type { Profile } from './profile';
import { DEFAULT_DISTRICT } from './sun';

export interface Settings {
  lang: Lang;
  districtId: string;
  /** Pick the district from the phone's location on each launch. Off once the user picks one by hand. */
  districtAuto: boolean;
  /** The location prompt is shown at most once automatically. */
  locationAsked: boolean;
  dailyReminder: boolean;
  ritualReminders: boolean;
  /** Checklist used when no profile is logged in. */
  guest: Profile;
  /** Optional on-device profiles (one per family member). Nothing here leaves the phone. */
  profiles: Profile[];
  activeProfileId: string | null;
  /** Optional WhatsApp group invite or call link pinned on the Live screen. */
  familyGroupLink: string;
}

const DEFAULTS: Settings = {
  lang: 'hi',
  districtId: DEFAULT_DISTRICT,
  districtAuto: true,
  locationAsked: false,
  dailyReminder: false,
  ritualReminders: false,
  guest: { id: 'guest', name: '', soops: DEFAULT_SOOPS, checked: [], hidden: [], custom: [] },
  profiles: [],
  activeProfileId: null,
  familyGroupLink: '',
};

/** Fills in fields added after v1.0 (which stored guest ticks as `checklist` and had no location mode). */
function migrate(saved: Partial<Settings> & { checklist?: string[] }): Settings {
  const { checklist, ...rest } = saved;
  const guest = rest.guest ?? { ...DEFAULTS.guest, checked: checklist ?? [] };
  // v1.0 had no auto mode: keep a district the user already chose.
  const districtAuto = rest.districtAuto ?? (!rest.districtId || rest.districtId === DEFAULT_DISTRICT);
  return { ...DEFAULTS, ...rest, guest, districtAuto };
}

const KEY = 'settings-v1';

interface Ctx {
  settings: Settings;
  loaded: boolean;
  update: (patch: Partial<Settings> | ((prev: Settings) => Partial<Settings>)) => void;
  t: (key: StringKey) => string;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setSettings(migrate(JSON.parse(raw)));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((patch: Partial<Settings> | ((prev: Settings) => Partial<Settings>)) => {
    setSettings((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({ settings, loaded, update, t: (key) => translate(settings.lang, key) }),
    [settings, loaded, update],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

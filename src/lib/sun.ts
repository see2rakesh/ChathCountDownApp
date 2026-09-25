import { getTimes } from 'suncalc';

import districtsData from '@/data/districts.json';
import { EDITIONS, type FestivalEdition, type Ritual } from '@/data/festival';
import { istInstant, istNoon } from './time';

export interface District {
  id: string;
  en: string;
  hi: string;
  lat: number;
  lon: number;
}

export const DISTRICTS: District[] = districtsData as District[];
export const DEFAULT_DISTRICT = 'patna';

export function getDistrict(id: string): District {
  return DISTRICTS.find((d) => d.id === id) ?? DISTRICTS.find((d) => d.id === DEFAULT_DISTRICT)!;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

const cache = new Map<string, SunTimes>();

/** Sunrise and sunset in India for a date (YYYY-MM-DD) at the district HQ. */
export function sunTimes(date: string, d: District): SunTimes {
  const k = `${date}|${d.id}`;
  const hit = cache.get(k);
  if (hit) return hit;
  const t = getTimes(istNoon(date), d.lat, d.lon);
  const v = { sunrise: t.sunrise as Date, sunset: t.sunset as Date };
  cache.set(k, v);
  return v;
}

/** The moment a ritual's countdown targets for a district. */
export function ritualInstant(r: Ritual, d: District): Date {
  const t = sunTimes(r.date, d);
  return r.anchor === 'sunrise' ? t.sunrise : t.sunset;
}

/** When the whole edition is over (end of Usha Arghya day). */
export function editionEnd(e: FestivalEdition): Date {
  const last = e.rituals[e.rituals.length - 1];
  return istInstant(last.date, 12, 0);
}

/** The edition to show: the first one that has not ended yet, else the latest. */
export function currentEdition(now = Date.now()): FestivalEdition {
  return EDITIONS.find((e) => editionEnd(e).getTime() > now) ?? EDITIONS[EDITIONS.length - 1];
}

export interface NextRitual {
  ritual: Ritual;
  at: Date;
}

/** The next ritual moment still in the future, or null when the edition is over. */
export function nextRitual(e: FestivalEdition, d: District, now = Date.now()): NextRitual | null {
  for (const r of e.rituals) {
    const at = ritualInstant(r, d);
    if (at.getTime() > now) return { ritual: r, at };
  }
  return null;
}

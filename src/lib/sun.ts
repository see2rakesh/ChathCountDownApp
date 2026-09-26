import { getTimes } from 'suncalc';

import placesData from '@/data/places.json';
import { EDITIONS, type FestivalEdition, type Ritual } from '@/data/festival';
import { addDays, IST, localInstant, localNoon } from './time';

/** A district HQ or a big city: the place whose sunrise and sunset the app shows. */
export interface District {
  id: string;
  en: string;
  hi: string;
  lat: number;
  lon: number;
  state: string;
  kind: 'district' | 'city';
  /** IANA time zone, e.g. Asia/Kolkata. */
  tz: string;
}

export interface Region {
  id: string;
  en: string;
  hi: string;
}

export interface State extends Region {
  country: string;
}

export const COUNTRIES: Region[] = placesData.countries;
export const STATES: State[] = placesData.states;
export const DISTRICTS: District[] = placesData.places as District[];
export const getState = (id: string): State | undefined => STATES.find((s) => s.id === id);
export const getCountry = (id: string): Region | undefined => COUNTRIES.find((c) => c.id === id);
export const countryOf = (d: District): string => getState(d.state)?.country ?? 'in';
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
  const t = getTimes(localNoon(d.tz, date), d.lat, d.lon);
  const v = { sunrise: t.sunrise as Date, sunset: t.sunset as Date };
  cache.set(k, v);
  return v;
}

/** The moment a ritual's countdown targets for a district. */
export function ritualInstant(r: Ritual, d: District): Date {
  const t = sunTimes(r.date, d);
  return r.anchor === 'sunrise' ? t.sunrise : t.sunset;
}

/** When the whole edition is over: the day after Usha Arghya (noon IST), so places west of India (the Americas) are covered too. */
export function editionEnd(e: FestivalEdition): Date {
  const last = e.rituals[e.rituals.length - 1];
  return localInstant(IST, addDays(last.date, 1), 12, 0);
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

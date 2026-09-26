import zoneData from '@/data/timezones.json';
import type { Lang } from './i18n';

/**
 * Time-zone maths without relying on the phone's Intl time-zone support (patchy on Android):
 * scripts/build-places.mjs writes each zone's UTC offset and DST changes to timezones.json.
 */
export const IST = 'Asia/Kolkata';

interface Zone {
  /** Offset in minutes at the start of the table. */
  o: number;
  /** [UTC ms, new offset in minutes] for each change. */
  c?: number[][];
}
const ZONES = zoneData.zones as Record<string, Zone>;

/** UTC offset of a time zone at an instant, in ms. Unknown zones fall back to IST. */
export function offsetMs(tz: string, utcMs: number): number {
  const z = ZONES[tz] ?? ZONES[IST];
  let o = z.o;
  for (const [at, off] of z.c ?? []) {
    if (utcMs < at) break;
    o = off;
  }
  return o * 60000;
}

/** Today's date in the time zone as YYYY-MM-DD. */
export function localDateString(tz: string, now: number = Date.now()): string {
  return new Date(now + offsetMs(tz, now)).toISOString().slice(0, 10);
}

/** Instant for a wall-clock time in the time zone (two passes so DST change days come out right). */
export function localInstant(tz: string, date: string, hh = 0, mm = 0): Date {
  const [y, m, d] = date.split('-').map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  const guess = wall - offsetMs(tz, wall);
  return new Date(wall - offsetMs(tz, guess));
}

/** Local noon on a date: a safe reference for "the solar day of this date" at a place. */
export function localNoon(tz: string, date: string): Date {
  return localInstant(tz, date, 12, 0);
}

function parts(d: Date, tz: string) {
  const s = new Date(d.getTime() + offsetMs(tz, d.getTime()));
  return { h: s.getUTCHours(), m: s.getUTCMinutes(), s: s.getUTCSeconds() };
}

/** Short zone name for the exact-time line: "IST", "NPT", else "GMT+4" / "GMT−5". */
export function zoneLabel(tz: string, at: Date): string {
  if (tz === IST) return 'IST';
  if (tz === 'Asia/Kathmandu') return 'NPT';
  const mins = offsetMs(tz, at.getTime()) / 60000;
  const abs = Math.abs(mins);
  const hm = abs % 60 ? `${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, '0')}` : `${abs / 60}`;
  return `GMT${mins < 0 ? '−' : '+'}${hm}`;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** e.g. "5:01 PM" in the time zone (rounded to the nearest minute). */
export function formatTime(d: Date, tz: string): string {
  const r = new Date(Math.round(d.getTime() / 60000) * 60000);
  const { h, m } = parts(r, tz);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

/** e.g. "17:00:59" in the time zone. */
export function formatTimeSeconds(d: Date, tz: string): string {
  const { h, m, s } = parts(d, tz);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
};
const WEEKDAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
};

/** e.g. "Sun, 15 Nov" / "रविवार, 15 नवंबर". */
export function formatDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WEEKDAYS[lang][wd]}, ${d} ${MONTHS[lang][m - 1]}`;
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** e.g. "13 Nov" / "13 नवंबर". */
export function formatDayMonth(date: string, lang: Lang): string {
  const [, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[lang][m - 1]}`;
}

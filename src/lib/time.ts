/** India has a fixed UTC+5:30 offset (no DST), so we do IST maths by hand instead of relying on Intl time-zone support. */
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

import type { Lang } from './i18n';

/** Today's date in India as YYYY-MM-DD. */
export function istDateString(now: number = Date.now()): string {
  return new Date(now + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Instant for a wall-clock time in India. */
export function istInstant(date: string, hh = 0, mm = 0): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - IST_OFFSET_MS);
}

/** Noon IST on a date — a safe reference for "the solar day of this date" in India. */
export function istNoon(date: string): Date {
  return istInstant(date, 12, 0);
}

function parts(d: Date) {
  const s = new Date(d.getTime() + IST_OFFSET_MS);
  return { h: s.getUTCHours(), m: s.getUTCMinutes(), s: s.getUTCSeconds() };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** e.g. "5:01 PM" (rounded to the nearest minute). */
export function formatTime(d: Date): string {
  const r = new Date(Math.round(d.getTime() / 60000) * 60000);
  const { h, m } = parts(r);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

/** e.g. "17:00:59" IST. */
export function formatTimeSeconds(d: Date): string {
  const { h, m, s } = parts(d);
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

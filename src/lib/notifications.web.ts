import type { Lang } from './i18n';

export const NOTIFICATIONS_SUPPORTED = false;

export async function ensurePermission(): Promise<boolean> {
  return false;
}

export async function rescheduleAll(_o: {
  lang: Lang;
  districtId: string;
  dailyReminder: boolean;
  ritualReminders: boolean;
}): Promise<void> {}

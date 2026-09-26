import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { currentEdition, getDistrict, sunTimes } from './sun';
import { translate, type Lang } from './i18n';
import { localInstant } from './time';

export const NOTIFICATIONS_SUPPORTED = true;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL = 'chhath';

export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Chhath reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

interface Opts {
  lang: Lang;
  districtId: string;
  dailyReminder: boolean;
  ritualReminders: boolean;
}

/** Clears and re-creates all local reminders from the current settings. */
export async function rescheduleAll(o: Opts): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!o.dailyReminder && !o.ritualReminders) return;
  if (!(await ensurePermission())) return;

  const hi = o.lang === 'hi';

  if (o.dailyReminder) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: translate(o.lang, 'todaysGeet'),
        body: hi ? 'शारदा सिन्हा जी का आज का छठ गीत सुनिए 🙏' : "Listen to today's Sharda Sinha Chhath geet 🙏",
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 7, minute: 0, channelId: CHANNEL },
    });
  }

  if (o.ritualReminders) {
    const d = getDistrict(o.districtId);
    const place = hi ? d.hi : d.en;
    const now = Date.now();
    for (const r of currentEdition().rituals) {
      const t = sunTimes(r.date, d);
      let at: Date;
      let body: string;
      switch (r.key) {
        case 'nahayKhay':
          at = localInstant(d.tz, r.date, 5, 0);
          body = hi ? 'आज नहाय-खाय है। छठ महापर्व की शुरुआत।' : 'Today is Nahay Khay. Chhath Mahaparv begins.';
          break;
        case 'kharna':
          at = localInstant(d.tz, r.date, 16, 0);
          body = hi ? 'आज शाम खरना का प्रसाद।' : 'Kharna prasad this evening.';
          break;
        case 'sandhyaArghya':
          at = new Date(t.sunset.getTime() - 45 * 60000);
          body = hi ? `${place} में 45 मिनट में सूर्यास्त। संध्या अर्घ्य की तैयारी करें।` : `Sunset in ${place} in 45 minutes. Get ready for Sandhya Arghya.`;
          break;
        case 'ushaArghya':
          at = new Date(t.sunrise.getTime() - 60 * 60000);
          body = hi ? `${place} में 1 घंटे में सूर्योदय। उषा अर्घ्य के लिए घाट चलें।` : `Sunrise in ${place} in 1 hour. Head to the ghat for Usha Arghya.`;
          break;
      }
      if (at.getTime() <= now) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title: hi ? r.name.hi : r.name.en, body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
      });
    }
  }
}

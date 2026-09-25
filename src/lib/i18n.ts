export type Lang = 'hi' | 'en';

const STRINGS = {
  appName: { en: 'Chhath Countdown', hi: 'छठ काउंटडाउन' },
  tabHome: { en: 'Home', hi: 'होम' },
  tabRituals: { en: 'Rituals', hi: 'अनुष्ठान' },
  tabGeet: { en: 'Geet', hi: 'गीत' },
  tabTribute: { en: 'Tribute', hi: 'श्रद्धांजलि' },
  tabVidhi: { en: 'Samagri', hi: 'सामग्री' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  next: { en: 'Next', hi: 'अगला' },
  days: { en: 'days', hi: 'दिन' },
  hours: { en: 'hrs', hi: 'घंटे' },
  minutes: { en: 'min', hi: 'मिनट' },
  seconds: { en: 'sec', hi: 'सेकंड' },
  day: { en: 'Day', hi: 'दिन' },
  sunrise: { en: 'Sunrise', hi: 'सूर्योदय' },
  sunset: { en: 'Sunset', hi: 'सूर्यास्त' },
  today: { en: 'Today', hi: 'आज' },
  district: { en: 'District', hi: 'ज़िला' },
  chooseDistrict: { en: 'Choose your district', hi: 'अपना ज़िला चुनें' },
  search: { en: 'Search district', hi: 'ज़िला खोजें' },
  todaysGeet: { en: "Today's Chhath Geet", hi: 'आज का छठ गीत' },
  listenNow: { en: 'Listen now', hi: 'अभी सुनें' },
  festivalDone: {
    en: 'Chhath Mahaparv is complete. Jai Chhathi Maiya!',
    hi: 'छठ महापर्व सम्पन्न हुआ। जय छठी मईया!',
  },
  nowHappening: { en: 'Happening now', hi: 'अभी चल रहा है' },
  arghyaTimer: { en: 'Arghya timer', hi: 'अर्घ्य टाइमर' },
  arghyaTimerSub: {
    en: 'Exact sunset and sunrise for your district',
    hi: 'आपके ज़िले का सटीक सूर्यास्त और सूर्योदय',
  },
  sunsetOn: { en: 'Sunset', hi: 'सूर्यास्त' },
  sunriseOn: { en: 'Sunrise', hi: 'सूर्योदय' },
  timeLeft: { en: 'Time left', hi: 'शेष समय' },
  done: { en: 'Completed', hi: 'सम्पन्न' },
  sunNote: {
    en: 'Calculated for the district headquarters (standard refraction, sea level). Your ghat may differ by 1–2 minutes, so reach early.',
    hi: 'ज़िला मुख्यालय के लिए गणना (मानक अपवर्तन)। आपके घाट पर 1–2 मिनट का अंतर हो सकता है, इसलिए समय से पहले पहुँचें।',
  },
  allDistricts: { en: 'All 38 districts', hi: 'सभी 38 ज़िले' },
  showAll: { en: 'Show all districts', hi: 'सभी ज़िले देखें' },
  hideAll: { en: 'Hide', hi: 'छुपाएँ' },
  prasad: { en: 'Prasad', hi: 'प्रसाद' },
  fourDays: { en: 'The four days', hi: 'चार दिन' },
  songOfDay: { en: 'Song of the Day', hi: 'आज का गीत' },
  singer: { en: 'Singer', hi: 'गायिका' },
  album: { en: 'Album', hi: 'एल्बम' },
  channel: { en: 'Official channel', hi: 'आधिकारिक चैनल' },
  openYouTube: { en: 'Open in YouTube', hi: 'YouTube में खोलें' },
  embedError: {
    en: 'This video cannot play inside the app. Tap below to watch it on YouTube.',
    hi: 'यह वीडियो ऐप में नहीं चल सकता। YouTube पर देखने के लिए नीचे दबाएँ।',
  },
  previousSongs: { en: 'Earlier songs', hi: 'पिछले गीत' },
  upcomingSongs: { en: 'new songs still to come', hi: 'नए गीत आने बाकी हैं' },
  seriesStarts: { en: 'Daily songs start on', hi: 'रोज़ के गीत शुरू होंगे' },
  preview: { en: 'Preview', hi: 'झलक' },
  jukebox: { en: 'Jukebox', hi: 'ज्यूकबॉक्स' },
  tributeTitle: { en: 'Sharda Sinha', hi: 'शारदा सिन्हा' },
  tributeSub: { en: 'Bihar Kokila (1952–2024)', hi: 'बिहार कोकिला (1952–2024)' },
  alsoLoved: { en: 'Other beloved Chhath voices', hi: 'छठ की अन्य प्रिय आवाज़ें' },
  samagriTitle: { en: 'Puja samagri checklist', hi: 'पूजा सामग्री सूची' },
  samagriSub: { en: 'Tick items as you arrange them. Saved on this device.', hi: 'सामान जुटाते हुए निशान लगाएँ। इसी फ़ोन में सेव रहेगा।' },
  reset: { en: 'Reset', hi: 'रीसेट' },
  language: { en: 'Language', hi: 'भाषा' },
  reminders: { en: 'Reminders', hi: 'रिमाइंडर' },
  dailySongReminder: { en: 'Daily song reminder (7:00 AM)', hi: 'रोज़ के गीत का रिमाइंडर (सुबह 7:00)' },
  ritualReminders: { en: 'Ritual & arghya reminders', hi: 'अनुष्ठान और अर्घ्य रिमाइंडर' },
  ritualRemindersSub: {
    en: 'Nahay Khay 5:00 AM, Kharna 4:00 PM, 45 min before sunset and 60 min before sunrise for your district',
    hi: 'नहाय-खाय सुबह 5:00, खरना शाम 4:00, आपके ज़िले के सूर्यास्त से 45 मिनट और सूर्योदय से 60 मिनट पहले',
  },
  remindersWebOnly: {
    en: 'Reminders work in the Android app. In the web app, add this page to your home screen.',
    hi: 'रिमाइंडर Android ऐप में काम करते हैं। वेब ऐप को होम स्क्रीन पर जोड़ें।',
  },
  permissionDenied: { en: 'Notifications are turned off for this app in phone settings.', hi: 'फ़ोन सेटिंग्स में इस ऐप की सूचनाएँ बंद हैं।' },
  about: { en: 'About', hi: 'ऐप के बारे में' },
  aboutText: {
    en: 'A devotional, non-commercial app for Chhath Mahaparv. Songs play from their official YouTube channels; all rights belong to the respective labels. Dates follow the Kartik Shukla panchang; ritual customs vary by family and region.',
    hi: 'छठ महापर्व के लिए एक भक्ति ऐप, बिना किसी व्यावसायिक उद्देश्य के। गीत उनके आधिकारिक YouTube चैनलों से चलते हैं; सभी अधिकार संबंधित लेबल के हैं। तिथियाँ कार्तिक शुक्ल पंचांग के अनुसार हैं; रीति-रिवाज परिवार और क्षेत्र के अनुसार अलग हो सकते हैं।',
  },
  privacy: { en: 'Privacy', hi: 'गोपनीयता' },
  privacyText: {
    en: 'This app collects no personal data. Your district, language and checklist stay on your device. Videos are served by YouTube under its own privacy policy.',
    hi: 'यह ऐप कोई निजी जानकारी नहीं लेता। आपका ज़िला, भाषा और सूची आपके फ़ोन में ही रहते हैं। वीडियो YouTube की अपनी गोपनीयता नीति के तहत चलते हैं।',
  },
  share: { en: 'Share the app', hi: 'ऐप शेयर करें' },
  shareMessage: {
    en: 'Chhath Mahaparv 2026 countdown, arghya timings for every Bihar district, and a daily Sharda Sinha geet:',
    hi: 'छठ महापर्व 2026 काउंटडाउन, बिहार के हर ज़िले का अर्घ्य समय और रोज़ शारदा सिन्हा का गीत:',
  },
  version: { en: 'Version', hi: 'संस्करण' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function translate(lang: Lang, key: StringKey): string {
  return STRINGS[key][lang];
}

export function pick<T>(lang: Lang, v: Record<Lang, T>): T {
  return v[lang];
}

import type { Lang } from '@/lib/i18n';

type L = Record<Lang, string>;

export type RitualKey = 'nahayKhay' | 'kharna' | 'sandhyaArghya' | 'ushaArghya';

/** Which sun event the ritual's countdown targets (computed per district). */
export type SunAnchor = 'sunrise' | 'sunset';

export interface Ritual {
  key: RitualKey;
  day: number;
  /** Date in India (YYYY-MM-DD). */
  date: string;
  anchor: SunAnchor;
  name: L;
  short: L;
  tithi: L;
  summary: L;
  details: L[];
  prasad: L;
}

export interface FestivalEdition {
  id: string;
  title: L;
  source: string;
  rituals: Ritual[];
}

/**
 * Dates: Kartik Shukla Chaturthi–Saptami 2026 (samvat.in, hindutone.com).
 * Add future editions (e.g. Chaiti Chhath 2027) here, and the app picks the next upcoming one.
 */
export const EDITIONS: FestivalEdition[] = [
  {
    id: 'kartik-2026',
    title: { en: 'Chhath Mahaparv 2026', hi: 'छठ महापर्व 2026' },
    source: 'Kartik Shukla Chaturthi – Saptami, Vikram Samvat 2083',
    rituals: [
      {
        key: 'nahayKhay',
        day: 1,
        date: '2026-11-13',
        anchor: 'sunrise',
        name: { en: 'Nahay Khay', hi: 'नहाय-खाय' },
        short: { en: 'Nahay Khay', hi: 'नहाय-खाय' },
        tithi: { en: 'Kartik Shukla Chaturthi', hi: 'कार्तिक शुक्ल चतुर्थी' },
        summary: {
          en: 'Holy bath and one pure (satvik) meal. The four-day vow begins.',
          hi: 'पवित्र स्नान और एक सात्विक भोजन। चार दिन के व्रत की शुरुआत।',
        },
        details: [
          { en: 'The house and kitchen are cleaned thoroughly.', hi: 'घर और रसोई की पूरी सफ़ाई की जाती है।' },
          { en: 'The vrati bathes in a river or pond (or at home with Ganga jal).', hi: 'व्रती नदी या तालाब में (या घर पर गंगाजल से) स्नान करते हैं।' },
          { en: 'One meal, cooked without onion or garlic, usually on a clay stove.', hi: 'बिना लहसुन-प्याज़ का एक समय भोजन, प्रायः मिट्टी के चूल्हे पर।' },
        ],
        prasad: { en: 'Kaddu-bhat: lauki (bottle gourd), chana dal and rice', hi: 'कद्दू-भात: लौकी, चने की दाल और चावल' },
      },
      {
        key: 'kharna',
        day: 2,
        date: '2026-11-14',
        anchor: 'sunset',
        name: { en: 'Kharna (Lohanda)', hi: 'खरना (लोहंडा)' },
        short: { en: 'Kharna', hi: 'खरना' },
        tithi: { en: 'Kartik Shukla Panchami', hi: 'कार्तिक शुक्ल पंचमी' },
        summary: {
          en: 'Day-long fast, broken in the evening with kheer prasad. Then the ~36-hour nirjala fast begins.',
          hi: 'दिनभर उपवास, शाम को खीर के प्रसाद से पारण। इसके बाद लगभग 36 घंटे का निर्जला व्रत।',
        },
        details: [
          { en: 'The vrati fasts through the day.', hi: 'व्रती दिनभर उपवास रखते हैं।' },
          { en: 'In the evening, gur (jaggery) kheer and roti are offered and eaten as prasad.', hi: 'शाम को गुड़ की खीर (रसियाव) और रोटी का भोग लगाकर प्रसाद ग्रहण किया जाता है।' },
          { en: 'After this, no food or water until the morning arghya.', hi: 'इसके बाद सुबह के अर्घ्य तक अन्न-जल नहीं।' },
        ],
        prasad: { en: 'Rasiya (gur kheer), roti, banana', hi: 'रसियाव (गुड़ की खीर), रोटी, केला' },
      },
      {
        key: 'sandhyaArghya',
        day: 3,
        date: '2026-11-15',
        anchor: 'sunset',
        name: { en: 'Sandhya Arghya', hi: 'संध्या अर्घ्य' },
        short: { en: 'Sandhya Arghya', hi: 'संध्या अर्घ्य' },
        tithi: { en: 'Kartik Shukla Shashthi', hi: 'कार्तिक शुक्ल षष्ठी' },
        summary: {
          en: 'Offering to the setting sun, standing in water at the ghat.',
          hi: 'घाट पर पानी में खड़े होकर अस्ताचलगामी सूर्य को अर्घ्य।',
        },
        details: [
          { en: 'Thekua and fruits are arranged in soop and daura (bamboo baskets).', hi: 'सूप और दउरा में ठेकुआ और फल सजाए जाते हैं।' },
          { en: 'Family carries the daura to the ghat, singing Chhath geet.', hi: 'परिवार छठ गीत गाते हुए दउरा लेकर घाट जाता है।' },
          { en: 'Arghya with milk and water is offered just before sunset.', hi: 'सूर्यास्त से ठीक पहले दूध और जल से अर्घ्य दिया जाता है।' },
        ],
        prasad: { en: 'Thekua, sugarcane, coconut, banana, seasonal fruits', hi: 'ठेकुआ, गन्ना, नारियल, केला, मौसमी फल' },
      },
      {
        key: 'ushaArghya',
        day: 4,
        date: '2026-11-16',
        anchor: 'sunrise',
        name: { en: 'Usha Arghya & Paran', hi: 'उषा अर्घ्य और पारण' },
        short: { en: 'Usha Arghya', hi: 'उषा अर्घ्य' },
        tithi: { en: 'Kartik Shukla Saptami', hi: 'कार्तिक शुक्ल सप्तमी' },
        summary: {
          en: 'Offering to the rising sun, then the fast is broken.',
          hi: 'उदीयमान सूर्य को अर्घ्य, फिर व्रत का पारण।',
        },
        details: [
          { en: 'Devotees reach the ghat before dawn.', hi: 'व्रती भोर से पहले घाट पहुँचते हैं।' },
          { en: 'Arghya is offered as the sun rises.', hi: 'सूर्योदय के समय अर्घ्य दिया जाता है।' },
          { en: 'Prasad is shared and the vrati breaks the fast (paran).', hi: 'प्रसाद बाँटा जाता है और व्रती पारण करते हैं।' },
        ],
        prasad: { en: 'Thekua and fruit prasad shared with everyone', hi: 'ठेकुआ और फल का प्रसाद सबमें बाँटा जाता है' },
      },
    ],
  },
];

export const SAMAGRI: { id: string; name: L }[] = [
  { id: 'soop', name: { en: 'Soop (bamboo winnowing tray)', hi: 'सूप (बाँस का)' } },
  { id: 'daura', name: { en: 'Daura (bamboo basket)', hi: 'दउरा (बाँस की टोकरी)' } },
  { id: 'thekua', name: { en: 'Thekua (wheat flour, gur, ghee)', hi: 'ठेकुआ (आटा, गुड़, घी)' } },
  { id: 'sugarcane', name: { en: 'Sugarcane with leaves', hi: 'पत्तों वाला गन्ना' } },
  { id: 'coconut', name: { en: 'Coconut (with husk)', hi: 'जटा वाला नारियल' } },
  { id: 'banana', name: { en: 'Bunch of bananas', hi: 'केले का घौद' } },
  { id: 'fruits', name: { en: 'Seasonal fruits (orange, sweet lime, sharifa)', hi: 'मौसमी फल (संतरा, मौसमी, शरीफ़ा)' } },
  { id: 'suthni', name: { en: 'Suthni, shakarkand, singhara', hi: 'सुथनी, शकरकंद, सिंघाड़ा' } },
  { id: 'haldi', name: { en: 'Fresh turmeric and ginger plants', hi: 'हल्दी और अदरक के पौधे' } },
  { id: 'nimbu', name: { en: 'Big lemon (gagal)', hi: 'बड़ा नींबू (गागल)' } },
  { id: 'lota', name: { en: 'Brass/copper lota for arghya', hi: 'अर्घ्य के लिए पीतल/ताँबे का लोटा' } },
  { id: 'milk', name: { en: 'Raw milk', hi: 'कच्चा दूध' } },
  { id: 'diya', name: { en: 'Diyas, ghee and cotton wicks', hi: 'दीये, घी और बाती' } },
  { id: 'sindoor', name: { en: 'Sindoor, roli, akshat', hi: 'सिंदूर, रोली, अक्षत' } },
  { id: 'clothes', name: { en: 'New clothes for the vrati', hi: 'व्रती के लिए नए वस्त्र' } },
];

export const SINGERS: { name: L; note: L }[] = [
  {
    name: { en: 'Maithili Thakur', hi: 'मैथिली ठाकुर' },
    note: {
      en: 'Young folk singer from Madhubani, known for traditional Maithili and Bhojpuri songs. Elected MLA from Alinagar in 2025.',
      hi: 'मधुबनी की युवा लोक गायिका, पारंपरिक मैथिली और भोजपुरी गीतों के लिए प्रसिद्ध। 2025 में अलीनगर से विधायक चुनी गईं।',
    },
  },
  {
    name: { en: 'Pawan Singh', hi: 'पवन सिंह' },
    note: { en: 'Bhojpuri film star whose Chhath songs are hugely popular every year.', hi: 'भोजपुरी फ़िल्म स्टार, जिनके छठ गीत हर साल बेहद लोकप्रिय होते हैं।' },
  },
  {
    name: { en: 'Anuradha Paudwal', hi: 'अनुराधा पौडवाल' },
    note: { en: 'Her devotional Chhath albums, like "Uga Hai Suraj Dev", are classics.', hi: '"उग हे सूरज देव" जैसे उनके छठ एल्बम आज भी लोकप्रिय हैं।' },
  },
  {
    name: { en: 'Kalpana Patowary', hi: 'कल्पना पटवारी' },
    note: { en: 'Folk singer who has recorded many Bhojpuri Chhath songs.', hi: 'लोक गायिका जिन्होंने कई भोजपुरी छठ गीत गाए हैं।' },
  },
  {
    name: { en: 'Khesari Lal Yadav', hi: 'खेसारी लाल यादव' },
    note: { en: 'Bhojpuri singer-actor with popular Chhath releases.', hi: 'भोजपुरी गायक-अभिनेता, जिनके छठ गीत लोकप्रिय हैं।' },
  },
];

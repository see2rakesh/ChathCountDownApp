// Builds src/data/places.json (India, Nepal and cities in countries with large Indian communities)
// and src/data/timezones.json (UTC offsets and DST changes for every place's time zone) from GeoNames.
//
// Usage:
//   1. Download and unzip into one folder (e.g. ./geo), from https://download.geonames.org/export/dump/ :
//        IN.zip, NP.zip, cities15000.zip, admin1CodesASCII.txt   -> IN.txt, NP.txt, cities15000.txt, admin1CodesASCII.txt
//        alternatenames/IN.zip                                     -> alt/IN.txt
//        alternatenames/<CC>.zip for NP and each country in ABROAD -> altw/<CC>/<CC>.txt
//   2. node scripts/build-places.mjs ./geo
//
// The time-zone table covers TZ_FROM..TZ_TO; extend it (and rerun) when adding a later festival year.
//
// Bihar keeps the hand-checked entries (ids, Hindi names, HQ coordinates) from scripts/bihar-districts.json,
// so ids saved on users' phones stay valid.
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) throw new Error('Usage: node scripts/build-places.mjs <geonames-folder>');

/**
 * Well-known cities people search for by name, listed besides their district
 * (skipped automatically when a district already has the same name). [GeoNames name, admin1 code, display name]
 */
const CITIES = [
  ['Delhi', '07'], ['Noida', '36'], ['Greater Noida', '36'], ['Ghaziabad', '36'], ['Faridabad', '10'], ['Gurugram', '10'],
  ['Navi Mumbai', '16'], ['Thane', '16'], ['Kalyan', '16'], ['Vasai', '16'], ['Pune', '16'], ['Pimpri-Chinchwad', '16'], ['Nagpur', '16'], ['Nashik', '16'],
  ['Bengaluru', '19'], ['Mysuru', '19'], ['Hubballi', '19'], ['Mangaluru', '19'],
  ['Hyderabad', '40'], ['Secunderabad', '40'], ['Warangal', '40'],
  ['Chennai', '25'], ['Coimbatore', '25'], ['Madurai', '25'],
  ['Kochi', '13'], ['Thiruvananthapuram', '13'], ['Kozhikode', '13'],
  ['Kolkata', '28'], ['Howrah', '28'], ['Siliguri', '28'], ['Durgapur', '28'], ['Asansol', '28'],
  ['Jamshedpur', '38'], ['Dhanbad', '38'], ['Ranchi', '38'],
  ['Bhubaneswar', '21'], ['Cuttack', '21'], ['Rourkela', '21'], ['Guwahati', '03'],
  ['Raipur', '37'], ['Bhilai', '37'], ['Bhopal', '35'], ['Indore', '35'], ['Jabalpur', '35'], ['Gwalior', '35'],
  ['Ahmedabad', '09'], ['Surat', '09'], ['Vadodara', '09'], ['Rajkot', '09'],
  ['Jaipur', '24'], ['Jodhpur', '24'], ['Kota', '24'], ['Udaipur', '24'],
  ['Ludhiana', '23'], ['Amritsar', '23'], ['Jalandhar', '23'], ['Chandigarh', '05'],
  ['Kanpur', '36'], ['Lucknow', '36'], ['Agra', '36'], ['Meerut', '36'], ['Prayagraj', '36'], ['Varanasi', '36'], ['Gorakhpur', '36'], ['Bareilly', '36'], ['Aligarh', '36'],
  ['Dehradun', '39'], ['Haridwar', '39'], ['Visakhapatnam', '02'], ['Vijayawada', '02'], ['Tirupati', '02'],
  ['Srinagar', '12'], ['Jammu', '12'], ['Panjim', '33', 'Panaji'],
];

// GeoNames admin1 code -> state / union territory.
const STATES = {
  '01': ['Andaman and Nicobar', 'अंडमान और निकोबार'],
  '02': ['Andhra Pradesh', 'आंध्र प्रदेश'],
  '03': ['Assam', 'असम'],
  '05': ['Chandigarh', 'चंडीगढ़'],
  '07': ['Delhi', 'दिल्ली'],
  '09': ['Gujarat', 'गुजरात'],
  '10': ['Haryana', 'हरियाणा'],
  '11': ['Himachal Pradesh', 'हिमाचल प्रदेश'],
  '12': ['Jammu and Kashmir', 'जम्मू और कश्मीर'],
  '13': ['Kerala', 'केरल'],
  '14': ['Lakshadweep', 'लक्षद्वीप'],
  '16': ['Maharashtra', 'महाराष्ट्र'],
  '17': ['Manipur', 'मणिपुर'],
  '18': ['Meghalaya', 'मेघालय'],
  '19': ['Karnataka', 'कर्नाटक'],
  '20': ['Nagaland', 'नागालैंड'],
  '21': ['Odisha', 'ओडिशा'],
  '22': ['Puducherry', 'पुडुचेरी'],
  '23': ['Punjab', 'पंजाब'],
  '24': ['Rajasthan', 'राजस्थान'],
  '25': ['Tamil Nadu', 'तमिलनाडु'],
  '26': ['Tripura', 'त्रिपुरा'],
  '28': ['West Bengal', 'पश्चिम बंगाल'],
  '29': ['Sikkim', 'सिक्किम'],
  '30': ['Arunachal Pradesh', 'अरुणाचल प्रदेश'],
  '31': ['Mizoram', 'मिज़ोरम'],
  '33': ['Goa', 'गोवा'],
  '34': ['Bihar', 'बिहार'],
  '35': ['Madhya Pradesh', 'मध्य प्रदेश'],
  '36': ['Uttar Pradesh', 'उत्तर प्रदेश'],
  '37': ['Chhattisgarh', 'छत्तीसगढ़'],
  '38': ['Jharkhand', 'झारखंड'],
  '39': ['Uttarakhand', 'उत्तराखंड'],
  '40': ['Telangana', 'तेलंगाना'],
  '41': ['Ladakh', 'लद्दाख'],
  '52': ['Dadra and Nagar Haveli and Daman and Diu', 'दादरा और नगर हवेली और दमन और दीव'],
};
const BIHAR = '34';

/** Hindi names GeoNames lacks, for places where many Chhath families live. Takes precedence over GeoNames. */
const HINDI = {
  // Uttar Pradesh
  Moradabad: 'मुरादाबाद', Mirzapur: 'मिर्ज़ापुर', Kanpur: 'कानपुर', Jhansi: 'झाँसी', Ghaziabad: 'ग़ाज़ियाबाद', Ayodhya: 'अयोध्या',
  'Bara Banki': 'बाराबंकी', Ballia: 'बलिया', Prayagraj: 'प्रयागराज', Agra: 'आगरा', Shrawasti: 'श्रावस्ती', Siddharthnagar: 'सिद्धार्थनगर',
  'Ambedkar Nagar': 'अंबेडकर नगर', Auraiya: 'औरैया', Balrampur: 'बलरामपुर', Maharajganj: 'महराजगंज', Mau: 'मऊ', Bhadohi: 'भदोही',
  Firozabad: 'फ़िरोज़ाबाद', Kannauj: 'कन्नौज', Kaushambi: 'कौशाम्बी', Baghpat: 'बागपत', 'Gautam Buddha Nagar': 'गौतम बुद्ध नगर',
  Chitrakoot: 'चित्रकूट', Chandauli: 'चंदौली', Hathras: 'हाथरस', Kasganj: 'कासगंज', Sonbhadra: 'सोनभद्र', Shamli: 'शामली',
  Amethi: 'अमेठी', Hapur: 'हापुड़', Sambhal: 'संभल', Unnao: 'उन्नाव',
  // Delhi
  'North Delhi': 'उत्तरी दिल्ली', 'East Delhi': 'पूर्वी दिल्ली', 'New Delhi': 'नई दिल्ली', 'South East': 'दक्षिण-पूर्वी दिल्ली', Shahdara: 'शाहदरा',
  // West Bengal
  Jalpaiguri: 'जलपाईगुड़ी', Hugli: 'हुगली', Haora: 'हावड़ा', Howrah: 'हावड़ा', Kolkata: 'कोलकाता', 'South 24 Parganas': 'दक्षिण 24 परगना',
  'North 24 Parganas': 'उत्तर 24 परगना', 'Paschim Medinipur': 'पश्चिम मेदिनीपुर', 'Purba Medinipur': 'पूर्व मेदिनीपुर', Kalimpong: 'कालिम्पोंग',
  Jhargram: 'झाड़ग्राम', Alipurduar: 'अलीपुरद्वार', 'Paschim Bardhaman': 'पश्चिम बर्धमान', Durgapur: 'दुर्गापुर',
  // Big cities and metros
  Mumbai: 'मुंबई', 'Mumbai Suburban': 'मुंबई उपनगर', Pune: 'पुणे', Nagpur: 'नागपुर', Nashik: 'नासिक', Kalyan: 'कल्याण', Vasai: 'वसई',
  Hyderabad: 'हैदराबाद', 'Bangalore Urban': 'बेंगलुरु शहरी', Bengaluru: 'बेंगलुरु', Surat: 'सूरत', Vadodara: 'वडोदरा', Rajkot: 'राजकोट',
  Bhopal: 'भोपाल', Faridabad: 'फ़रीदाबाद', Amritsar: 'अमृतसर', Haridwar: 'हरिद्वार', Chandigarh: 'चंडीगढ़', Kota: 'कोटा', Udaipur: 'उदयपुर',
  Madurai: 'मदुरै', Ernakulam: 'एर्णाकुलम', Visakhapatnam: 'विशाखापत्तनम', Hubballi: 'हुबली', Srinagar: 'श्रीनगर', Khordha: 'खोरधा',
  'Kamrup Metropolitan': 'कामरूप महानगर',
};

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const stateId = (code) => slug(STATES[code][0]);
const round = (n) => Math.round(n * 1e4) / 1e4;
/** Compare names loosely ("Purbi Singhbhum" vs "Purba Singhbhum District"). */
const key = (s) => slug(s.replace(/\b(district|division)\b/gi, '')).replace(/-/g, '');

async function lines(file, fn) {
  const rl = createInterface({ input: createReadStream(file, 'utf8'), crlfDelay: Infinity });
  for await (const line of rl) if (line) fn(line.split('\t'));
}

/** Countries besides India and Nepal: [code, English, Hindi, minimum city population]. */
const ABROAD = [
  ['AE', 'United Arab Emirates', 'संयुक्त अरब अमीरात', 30_000],
  ['SA', 'Saudi Arabia', 'सऊदी अरब', 100_000],
  ['QA', 'Qatar', 'क़तर', 50_000],
  ['KW', 'Kuwait', 'कुवैत', 50_000],
  ['OM', 'Oman', 'ओमान', 50_000],
  ['BH', 'Bahrain', 'बहरीन', 15_000],
  ['US', 'United States', 'संयुक्त राज्य अमेरिका', 100_000],
  ['CA', 'Canada', 'कनाडा', 100_000],
  ['GB', 'United Kingdom', 'यूनाइटेड किंगडम', 100_000],
  ['IE', 'Ireland', 'आयरलैंड', 50_000],
  ['NL', 'Netherlands', 'नीदरलैंड', 100_000],
  ['DE', 'Germany', 'जर्मनी', 200_000],
  ['AU', 'Australia', 'ऑस्ट्रेलिया', 50_000],
  ['NZ', 'New Zealand', 'न्यूज़ीलैंड', 50_000],
  ['SG', 'Singapore', 'सिंगापुर', 100_000],
  ['MY', 'Malaysia', 'मलेशिया', 100_000],
  ['MU', 'Mauritius', 'मॉरीशस', 15_000],
  ['FJ', 'Fiji', 'फ़िजी', 15_000],
  ['TT', 'Trinidad and Tobago', 'त्रिनिदाद और टोबैगो', 15_000],
  ['SR', 'Suriname', 'सूरीनाम', 15_000],
  ['GY', 'Guyana', 'गयाना', 15_000],
  ['ZA', 'South Africa', 'दक्षिण अफ़्रीका', 200_000],
];
const NEPAL_CITY_MIN_POP = 15_000;
/** Nepal names GeoNames lacks in Devanagari: provinces, and districts/towns where Chhath is widely observed. */
const NP_HINDI = {
  Koshi: 'कोशी', Madhesh: 'मधेश', 'Bagmati Province': 'बागमती प्रदेश', 'Gandaki Pradesh': 'गण्डकी प्रदेश',
  'Lumbini Province': 'लुम्बिनी प्रदेश', 'Karnali Pradesh': 'कर्णाली प्रदेश', 'Sudurpashchim Pradesh': 'सुदूरपश्चिम प्रदेश',
  Bara: 'बारा', Dhanusa: 'धनुषा', Mahottari: 'महोत्तरी', Parsa: 'पर्सा', Rautahat: 'रौतहट', Saptari: 'सप्तरी', Sarlahi: 'सर्लाही',
  Siraha: 'सिरहा', Morang: 'मोरंग', Sunsari: 'सुनसरी', Jhapa: 'झापा', Kathmandu: 'काठमांडू', Lalitpur: 'ललितपुर', Bhaktapur: 'भक्तपुर',
  Chitawan: 'चितवन', Birganj: 'बीरगंज', Lahan: 'लहान', Rajbiraj: 'राजबिराज', Gaur: 'गौर', Jaleshwar: 'जलेश्वर', Malangawa: 'मलंगवा',
  Biratnagar: 'विराटनगर', Dharan: 'धरान', Itahari: 'इटहरी', Pokhara: 'पोखरा', Janakpur: 'जनकपुर',
};
const TZ_FROM = Date.UTC(2026, 0, 1);
const TZ_TO = Date.UTC(2029, 0, 1);
const IST = 'Asia/Kolkata';

/** GeoNames id -> Hindi name from alternate-name files (earlier languages in `langs` win; Nepali Devanagari fills gaps). */
async function readHindi(files, langs = ['hi']) {
  const out = new Map();
  const rank = new Map();
  for (const file of files) {
    await lines(file, (c) => {
      const [, geonameid, lang, name, preferred] = c;
      const li = langs.indexOf(lang);
      if (li < 0 || !name) return;
      const score = li * 2 + (preferred === '1' ? 0 : 1);
      if (!rank.has(geonameid) || score < rank.get(geonameid)) {
        rank.set(geonameid, score);
        out.set(geonameid, name);
      }
    });
  }
  return out;
}

/** Hindi name without a leading/trailing "district" word; non-Devanagari entries are ignored. */
const clean = (s) => (s && /[ऀ-ॿ]/.test(s) ? s.replace(/^(जिला|ज़िला)\s+|\s+(जिला|ज़िला|जनपद|जिल्ला)$/g, '') : undefined);

const hindi = await readHindi([join(dir, 'alt', 'IN.txt')]);
const hindiName = (id) => clean(hindi.get(id));

const districts = [];
const towns = [];
await lines(join(dir, 'IN.txt'), (c) => {
  const [id, , ascii, , lat, lon, fclass, fcode, , , admin1, admin2, , , pop] = c;
  if (!STATES[admin1]) return;
  const row = { id, name: ascii, lat: Number(lat), lon: Number(lon), admin1, admin2, pop: Number(pop) || 0, fcode };
  if (fcode === 'ADM2') districts.push(row);
  else if (fclass === 'P') towns.push(row);
});

// A district's HQ is usually the biggest town that shares its name; fall back to the district's centre point.
const hqIn = (list, d) =>
  list
    .filter((t) => t.admin1 === d.admin1 && /^PPL(A\d?|C)?$/.test(t.fcode) && key(t.name) === key(d.name))
    .sort((a, b) => (a.admin2 === d.admin2 ? -1 : 0) - (b.admin2 === d.admin2 ? -1 : 0) || b.pop - a.pop)[0];

const places = [];
const bihar = JSON.parse(readFileSync(new URL('./bihar-districts.json', import.meta.url), 'utf8'));
for (const d of bihar) places.push({ ...d, state: stateId(BIHAR), kind: 'district', tz: IST });

const districtKeys = new Set();
for (const d of districts) {
  districtKeys.add(`${d.admin1}|${key(d.name)}`);
  if (d.admin1 === BIHAR) continue;
  const hq = hqIn(towns, d);
  const name = d.name.replace(/^District\s+|\s+(District|Division)$/gi, '').replace(/\s+/g, ' ');
  places.push({
    id: `${stateId(d.admin1)}:${slug(name)}`,
    en: name,
    hi: HINDI[name] ?? hindiName(d.id) ?? name,
    lat: round(hq ? hq.lat : d.lat),
    lon: round(hq ? hq.lon : d.lon),
    state: stateId(d.admin1),
    kind: 'district',
    tz: IST,
  });
}

// Indian cities get their own entry unless a district of the same name already covers them.
const missing = [];
for (const [geoName, admin1, name = geoName] of CITIES) {
  if (districtKeys.has(`${admin1}|${key(geoName)}`)) continue;
  const t = towns.filter((x) => x.admin1 === admin1 && key(x.name) === key(geoName)).sort((a, b) => b.pop - a.pop)[0];
  if (!t) {
    missing.push(geoName);
    continue;
  }
  places.push({
    id: `${stateId(admin1)}:${slug(name)}-city`,
    en: name,
    hi: HINDI[name] ?? hindiName(t.id) ?? name,
    lat: round(t.lat),
    lon: round(t.lon),
    state: stateId(admin1),
    kind: 'city',
    tz: IST,
  });
}
if (missing.length) throw new Error(`Cities not found in GeoNames: ${missing.join(', ')}`);

const states = Object.entries(STATES).map(([code, [en, hi]]) => ({ id: stateId(code), en, hi, country: 'in' }));
const countries = [{ id: 'in', en: 'India', hi: 'भारत' }];

// ---- Abroad: states/provinces from admin1 codes, cities from cities15000 ----
const admin1Names = new Map(); // "CC.code" -> { name, geonameid }
await lines(join(dir, 'admin1CodesASCII.txt'), (c) => admin1Names.set(c[0], { name: c[2] || c[1], geonameid: c[3] }));

const worldCities = [];
await lines(join(dir, 'cities15000.txt'), (c) => {
  const [id, , ascii, , lat, lon, , fcode, cc, , a1, , , , pop, , , tz] = c;
  worldCities.push({ id, name: ascii, lat: Number(lat), lon: Number(lon), cc, admin1: a1, pop: Number(pop) || 0, fcode, tz });
});

function addState(cc, code, hindiNames, overrides = {}) {
  const a = admin1Names.get(`${cc}.${code}`);
  const id = `${cc.toLowerCase()}:${a ? slug(a.name) : 'other'}`;
  if (!states.some((s) => s.id === id)) {
    const en = a ? a.name : 'Other';
    states.push({ id, en, hi: overrides[en] ?? ((a && clean(hindiNames.get(a.geonameid))) || en), country: cc.toLowerCase() });
  }
  return id;
}

function addCity(t, state, hindiNames, suffix = '', overrides = {}) {
  const id = `${state}:${slug(t.name)}${suffix}`;
  if (places.some((p) => p.id === id)) return; // same-name town in the same state: keep the bigger one (list is sorted)
  places.push({ id, en: t.name, hi: overrides[t.name] ?? (clean(hindiNames.get(t.id)) || t.name), lat: round(t.lat), lon: round(t.lon), state, kind: 'city', tz: t.tz });
}

// Nepal: all 77 districts (Chhath is widely observed in Madhesh), plus its towns.
{
  countries.push({ id: 'np', en: 'Nepal', hi: 'नेपाल' });
  const hi = await readHindi([join(dir, 'altw', 'NP', 'NP.txt')], ['hi', 'ne']);
  const npDistricts = [];
  const npTowns = [];
  await lines(join(dir, 'NP.txt'), (c) => {
    const [id, , ascii, , lat, lon, fclass, fcode, , , a1, a2, , , pop] = c;
    const row = { id, name: ascii, lat: Number(lat), lon: Number(lon), admin1: a1, admin2: a2, pop: Number(pop) || 0, fcode };
    if (fcode === 'ADM2') npDistricts.push(row);
    else if (fclass === 'P') npTowns.push(row);
  });
  const npKeys = new Set();
  for (const d of npDistricts) {
    const state = addState('NP', d.admin1, hi, NP_HINDI);
    const hq = hqIn(npTowns, d);
    npKeys.add(`${d.admin1}|${key(d.name)}`);
    places.push({
      id: `${state}:${slug(d.name)}`,
      en: d.name,
      hi: NP_HINDI[d.name] ?? (clean(hi.get(d.id)) || d.name),
      lat: round(hq ? hq.lat : d.lat),
      lon: round(hq ? hq.lon : d.lon),
      state,
      kind: 'district',
      tz: 'Asia/Kathmandu',
    });
  }
  for (const t of worldCities.filter((c) => c.cc === 'NP' && c.pop >= NEPAL_CITY_MIN_POP).sort((a, b) => b.pop - a.pop)) {
    if (npKeys.has(`${t.admin1}|${key(t.name)}`)) continue;
    addCity(t, addState('NP', t.admin1, hi, NP_HINDI), hi, '-city', NP_HINDI);
  }
}

for (const [cc, en, hiName, minPop] of ABROAD) {
  countries.push({ id: cc.toLowerCase(), en, hi: hiName });
  const hi = await readHindi([join(dir, 'altw', cc, `${cc}.txt`)]);
  const list = worldCities.filter((c) => c.cc === cc && c.pop >= minPop && /^PPL/.test(c.fcode)).sort((a, b) => b.pop - a.pop);
  if (list.length === 0) throw new Error(`No cities for ${cc}`);
  for (const t of list) addCity(t, addState(cc, t.admin1, hi), hi);
}

const ids = new Set();
for (const p of places) {
  if (ids.has(p.id)) throw new Error(`Duplicate id ${p.id}`);
  if (!p.tz) throw new Error(`No time zone for ${p.id}`);
  ids.add(p.id);
}
states.sort((a, b) => a.en.localeCompare(b.en));

// ---- Time zones: offset at TZ_FROM plus every change until TZ_TO, found with Node's full ICU data ----
const formatters = new Map();
function offsetMinutes(tz, ms) {
  if (!formatters.has(tz)) {
    formatters.set(
      tz,
      new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
    );
  }
  const p = Object.fromEntries(formatters.get(tz).formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const wall = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute));
  return Math.round((wall - Math.floor(ms / 60000) * 60000) / 60000);
}
const zones = {};
for (const tz of [...new Set(places.map((p) => p.tz))].sort()) {
  const start = offsetMinutes(tz, TZ_FROM);
  const changes = [];
  let prev = start;
  for (let t = TZ_FROM + 3600000; t <= TZ_TO; t += 3600000) {
    const o = offsetMinutes(tz, t);
    if (o === prev) continue;
    // Narrow the change down to the minute.
    let lo = t - 3600000;
    let hi = t;
    while (hi - lo > 60000) {
      const mid = lo + Math.floor((hi - lo) / 120000) * 60000;
      if (offsetMinutes(tz, mid) === prev) lo = mid;
      else hi = mid;
    }
    changes.push([hi, o]);
    prev = o;
  }
  zones[tz] = changes.length ? { o: start, c: changes } : { o: start };
}

const out = (file, data) => writeFileSync(new URL(`../src/data/${file}`, import.meta.url), JSON.stringify(data, null, 1));
out('places.json', { source: 'GeoNames (CC BY 4.0), Bihar hand-checked', countries, states, places });
out('timezones.json', { from: new Date(TZ_FROM).toISOString(), to: new Date(TZ_TO).toISOString(), zones });

const count = (kind) => places.filter((p) => p.kind === kind).length;
console.log(`${countries.length} countries, ${states.length} states, ${count('district')} districts, ${count('city')} cities, ${Object.keys(zones).length} time zones`);

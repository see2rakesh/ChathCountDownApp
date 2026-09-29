# Indian Festival Countdown · भारतीय त्योहार काउंटडाउन

Countdown app for Chhath Mahaparv 2026 (13–16 Nov). It shows arghya times for every district in India and Nepal and for cities worldwide, plays one Sharda Sinha Chhath geet each day, and has a playlist of traditional Chhath songs by several singers.
Built with **Expo (React Native + TypeScript)**. The same code produces the **web app (PWA)** and the **Android APK**.

| Screen | What it does |
|---|---|
| Home | Countdown to the next ritual for your district, 4-day strip, today's sunrise/sunset, today's geet |
| Rituals (अनुष्ठान) | Arghya timer: sunset on 15 Nov and sunrise on 16 Nov with live counters, the four days in detail, and a table for every district in your state |
| Geet (गीत) | Song of the day (YouTube embed), earlier songs, and a Chhath geet playlist by singer |
| Samagri (सामग्री) | Puja items checklist grouped by shop: add/remove items, number of soops, share what's left on WhatsApp; optional on-device profiles |
| Tribute (श्रद्धांजलि) | Sharda Sinha, plus other beloved Chhath voices |
| Story of Chhath | History, meaning, the legends of how it began, and where it is celebrated |
| Live | Family video call and "go live" buttons (WhatsApp, Instagram, Facebook), live broadcasts from the ghats |
| Settings | Hindi/English, location (automatic or Country → State → District/City), reminders (Android), about and privacy |

## Run it on your computer

```bash
npm install
npm run web          # opens the web app in your browser
npx expo start       # scan the QR code with the "Expo Go" app on your Android phone
```

## Publish the web app (free, GitHub Pages)

1. Create a GitHub repo named **ChathCountDownApp**. If you use another name, change `experiments.baseUrl` in `app.json` to `/<repo-name>` for local builds. The GitHub Actions build sets it for you.
2. Move the two workflow files into place (once): create the folder `.github\workflows` and move
   `ci-workflows\deploy-web.yml` and `ci-workflows\build-apk.yml` into it.
   ```powershell
   mkdir .github\workflows; move ci-workflows\*.yml .github\workflows\
   ```
3. Push this folder:
   ```bash
   git init && git add . && git commit -m "Chhath Countdown app"
   git branch -M main
   git remote add origin https://github.com/<your-user>/ChathCountDownApp.git
   git push -u origin main
   ```
4. In the repo, open **Settings → Pages → Source → GitHub Actions**.
5. The **Deploy web app** workflow runs on every push. The site appears at
   `https://<your-user>.github.io/ChathCountDownApp/`
6. People open that link on their phone and choose **Add to Home Screen** (Android Chrome or iPhone Safari).

## Build the Android APK (free)

**Option A: GitHub Actions (no extra account).**
Go to **Actions → Build Android APK → Run workflow**. It takes about 15–20 min. When it finishes, download `chhath-countdown-apk` from the run page.
Push a tag to attach the APK to a public Release you can share:
```bash
git tag v1.0.0 && git push origin v1.0.0
```

**Option B: Expo EAS (free Expo account).**
```bash
npx eas-cli login
npm run build:apk     # eas build -p android --profile preview → gives a download link / QR
```

**Sharing the APK.** Send the GitHub Release link (or the file) on WhatsApp.
- Users must allow "Install unknown apps" for their browser or WhatsApp.
- Play Protect may warn that the app is from an unknown developer; they tap **More details → Install anyway**.
- Google's developer-verification rule reaches India in 2027. Before then, move to the Play Store ($25 one-time) or register as a developer.

> Signing: the GitHub build signs with the standard debug key from the Expo template.
> That is fine for sharing the APK directly. Before any Play Store release, create your own upload keystore with EAS or Android Studio and keep it safe.
> If the signing key changes later, users will have to uninstall and reinstall the app.

## Build the AAB for Google Play

Google Play accepts an **Android App Bundle (`.aab`)**, not an APK. Expo's free cloud service (EAS) builds it and creates and stores your signing key.

**You need:** a verified Google Play developer account, a free Expo account (https://expo.dev/signup), and Node.js on your computer.

### 1. Set the version (every upload)

Both settings are in `app.json`, inside the `"expo"` block:

```json
{
  "expo": {
    "version": "1.0.0",          ← the version users see
    "android": {
      "versionCode": 1,          ← must go up for every upload
```

- **`versionCode`** (inside `"android"`): a whole number that **must go up by at least 1 for every upload** (1, 2, 3…). Play rejects a number it has seen before, even from a rejected or draft release. For the very first upload, leave it at `1`.
- **`version`**: the version users see, e.g. `1.0.0`, then `1.0.1` or `1.1.0`. Changing it is optional.

If you changed either, commit and push.

### 2. Build

```powershell
cd D:\repo\ChathCountDownApp
npm ci                      # first time, or after package changes
npx eas-cli login           # your Expo account
npx eas-cli build -p android --profile production
```

The first build asks two questions:

| Question | Answer |
|---|---|
| Create an EAS project? | **Y** (writes `extra.eas.projectId` into `app.json`; commit it) |
| Generate a new Android Keystore? | **Y** (EAS keeps this **upload key**; you never need the file for normal builds) |

The terminal prints a build page link. Free builds wait in a queue first; allow 15–45 min in total. You can close the terminal, the build keeps running. When the page shows **Finished**, click **Download** to get the `.aab`.

The `production` profile in `eas.json` builds an app bundle and sets `SONGS_URL` and `SHARE_URL` to the GitHub Pages site, so the Play app loads songs, the playlist and live links from the website like the APK does. If you rename the repo or use another GitHub account, update those two URLs.

**Back up the upload key (once):** `npx eas-cli credentials` → Android → production → *Download credentials*. Keep the file and passwords somewhere safe (not in Git). If it is ever lost, Play support can reset the upload key, but it takes time.

### 3. Upload to Play Console

1. https://play.google.com/console → your app (create it first: name, default language, App, Free).
2. First release of a new personal account: **Test and release → Testing → Closed testing** → create a track, add **India** (and other countries) under *Countries/regions*, and an email list of **at least 12 testers**.
   Later releases, once production access is granted: **Test and release → Production**.
3. **Create new release** → accept **Play App Signing** if asked → **Upload** the `.aab` → release name (e.g. `1.1.0`) and release notes → **Next → Save → Send for review**.
4. Closed testing: share the *Join on the web* link with the testers. All 12 must stay opted in for **14 days in a row**, then apply for production from the Dashboard.

Before the first review, complete the app's **App content** tasks: privacy policy URL (`https://<your-user>.github.io/ChathCountDownApp/privacy.html`), Data safety (*no data collected*: location is used only on the phone), content rating, target audience (13+ or 18+), ads: No.

### Tips

- **"Version code 1 has already been used"**: raise `versionCode` in `app.json` and build again.
- **Optional automatic upload:** `npx eas-cli submit -p android --latest` uploads the last build, but needs a Google Cloud service-account key linked to Play Console. Uploading by hand is simpler for occasional releases.
- **Building on your own computer instead** (`npx expo prebuild -p android`, then `gradlew bundleRelease`) needs Android Studio, a JDK and your own keystore wired into Gradle. EAS is recommended.
- **APK users switching to Play:** the Play version is signed with a different key than the GitHub APK, so people must uninstall the APK first (this clears their checklist and settings).
- Song, playlist and live-link changes are read from the website, so they don't need a new AAB. A new AAB is needed only for app code or `app.json` changes.

## Change a song or add songs

All songs are in `src/data/songs.json` (one entry per date, 20 Oct – 16 Nov 2026).
- **Web app:** push the change and the site redeploys.
- **Installed APKs:** the app downloads the latest `songs.json` from your GitHub Pages site when it opens. The APK workflow sets this URL automatically, so a song swap does **not** need a new APK.
- Outside the 28-day series, the app cycles through the list, so there is always a "song of the day".

Check that every video still exists and still allows embedding:
```bash
npm run check-videos
```

## Next year / Chaiti Chhath

Add a new edition to `EDITIONS` in `src/data/festival.ts` (dates and sunrise/sunset anchors). The app automatically shows the next edition that has not ended yet.

## How the arghya times are calculated

- Sunrise and sunset are computed on the device with [suncalc](https://github.com/mourner/suncalc): standard −0.833° refraction, coordinates from `src/data/places.json`: every district of India (Bihar hand-checked) and Nepal, plus cities in 22 countries with large Indian communities (Gulf, US, UK, Canada, Australia, Mauritius, Fiji, Trinidad, Suriname and others), from GeoNames. Each place has its time zone; `src/data/timezones.json` holds UTC offsets and DST changes for 2026–2028, so times are right without relying on the phone's time-zone support. Regenerate both with `node scripts/build-places.mjs <geonames-folder>` (see the script header), and extend the table before adding a festival year after 2028.
- For Patna on 15 Nov 2026 the app shows sunset **5:01 PM**. The NOAA algorithm (astral) gives 17:00:44 against the app's 17:00:59. Published panchang tables show 5:01–5:03 PM.
- The app tells users to reach the ghat early.

## Project layout

```
src/app/            screens (expo-router): (tabs)/index, anushthan, geet, vidhi, tribute; settings, profile, live, katha
src/components/     UI pieces: countdown, arghya card, location picker, YouTube player (native + web)
src/lib/            time (time zones), sun, location, songs, playlist, live, profile, settings, notifications, i18n
src/data/           festival.ts (dates, rituals, samagri), katha.ts, songs.json, playlist.json, live.json, places.json, timezones.json
scripts/            prepare-web.mjs (PWA manifest + service worker), check-videos.mjs, build-places.mjs
.github/workflows/  deploy-web.yml, build-apk.yml
```

## Content and rights

- Videos are embedded from their official YouTube channels (T-Series Bhakti Sagar, T-Series Hamaar Bhojpuri, Worldwide Records Bhojpuri, Sharda Sinha Official, Maithili Thakur, Chandan Tiwari {Purabiyataan}, Kalpana Patowary - Topic). Add only videos from a label's or artist's official channel; `npm run check-videos` fails if a video is gone, can't be embedded, or isn't on the credited channel.
- No audio files, lyrics or singer photos are bundled with the app.
- The app is devotional and non-commercial, and collects no personal data.

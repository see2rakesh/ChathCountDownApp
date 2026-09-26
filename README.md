# Chhath Countdown · छठ काउंटडाउन

Countdown app for Chhath Mahaparv 2026 (13–16 Nov). It shows arghya times worked out for every Bihar district and plays one Sharda Sinha Chhath geet each day.
Built with **Expo (React Native + TypeScript)**. The same code produces the **web app (PWA)** and the **Android APK**.

| Screen | What it does |
|---|---|
| Home | Countdown to the next ritual for your district, 4-day strip, today's sunrise/sunset, today's geet |
| Rituals (अनुष्ठान) | Arghya timer: sunset on 15 Nov and sunrise on 16 Nov with live counters, the four days in detail, and a table for all 38 districts |
| Geet (गीत) | Song of the day (YouTube embed), earlier songs |
| Samagri (सामग्री) | Puja items checklist, saved on the device |
| Tribute (श्रद्धांजलि) | Sharda Sinha, plus other beloved Chhath voices |
| Settings | Hindi/English, district, reminders (Android), about and privacy |

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
src/app/            screens (expo-router): (tabs)/index, anushthan, geet, vidhi, tribute; settings
src/components/     UI pieces: countdown, arghya card, district picker, YouTube player (native + web)
src/lib/            time (IST maths), sun, songs, settings, notifications, i18n
src/data/           festival.ts (dates, rituals, samagri), songs.json, districts.json
scripts/            prepare-web.mjs (PWA manifest + service worker), check-videos.mjs
.github/workflows/  deploy-web.yml, build-apk.yml
```

## Content and rights

- Videos are embedded from their official YouTube channels (T-Series Bhakti Sagar, T-Series Hamaar Bhojpuri, Worldwide Records Bhojpuri, Sharda Sinha Official).
- No audio files, lyrics or singer photos are bundled with the app.
- The app is devotional and non-commercial, and collects no personal data.

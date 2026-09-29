// Checks every video in src/data/songs.json and src/data/playlist.json through YouTube oEmbed.
// A 401/403 means the owner has disabled embedding; 404 means the video is gone.
// A channel mismatch means the video is not (or no longer) on the official channel we credit.
// Usage: npm run check-videos
import { readFileSync } from 'node:fs';

const daily = JSON.parse(readFileSync('src/data/songs.json', 'utf8')).songs.map((s) => ({ ...s, label: s.date }));
const playlist = JSON.parse(readFileSync('src/data/playlist.json', 'utf8')).songs.map((s) => ({ ...s, label: `playlist:${s.singer}` }));
let bad = 0;
for (const s of [...daily, ...playlist]) {
  const url = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${s.youtubeId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      bad++;
      console.log(`✗ ${s.label}  ${s.youtubeId}  HTTP ${res.status}  ${s.title.en}`);
      continue;
    }
    const j = await res.json();
    if (j.author_name !== s.channel) {
      bad++;
      console.log(`✗ ${s.label}  ${s.youtubeId}  channel is "${j.author_name}", expected "${s.channel}"`);
      continue;
    }
    console.log(`✓ ${s.label}  ${s.youtubeId}  ${j.author_name}`);
  } catch (e) {
    bad++;
    console.log(`? ${s.label}  ${s.youtubeId}  ${e.message}`);
  }
}
console.log(bad ? `\n${bad} video(s) need replacing.` : '\nAll videos are embeddable and on their official channels.');
process.exit(bad ? 1 : 0);

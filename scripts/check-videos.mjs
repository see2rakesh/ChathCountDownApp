// Checks every video in src/data/songs.json through YouTube oEmbed.
// A 401/403 means the owner has disabled embedding; 404 means the video is gone.
// Usage: npm run check-videos
import { readFileSync } from 'node:fs';

const { songs } = JSON.parse(readFileSync('src/data/songs.json', 'utf8'));
let bad = 0;
for (const s of songs) {
  const url = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${s.youtubeId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      bad++;
      console.log(`✗ ${s.date}  ${s.youtubeId}  HTTP ${res.status}  ${s.title.en}`);
      continue;
    }
    const j = await res.json();
    const mismatch = j.author_name !== s.channel ? `  (channel is "${j.author_name}")` : '';
    console.log(`✓ ${s.date}  ${s.youtubeId}  ${j.author_name}${mismatch}`);
  } catch (e) {
    bad++;
    console.log(`? ${s.date}  ${s.youtubeId}  ${e.message}`);
  }
}
console.log(bad ? `\n${bad} video(s) need replacing.` : '\nAll videos are embeddable.');
process.exit(bad ? 1 : 0);

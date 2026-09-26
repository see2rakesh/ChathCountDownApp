import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import bundled from '@/data/live.json';
import { remoteFileUrl } from './config';
import type { Lang } from './i18n';

export interface LiveLink {
  title: Record<Lang, string>;
  url: string;
  /** Channel or organiser, shown under the title. */
  source: string;
}

export interface LiveFile {
  updated: string;
  links: LiveLink[];
}

const CACHE_KEY = 'live-cache-v1';

function isValid(f: unknown): f is LiveFile {
  const l = (f as LiveFile)?.links;
  return Array.isArray(l) && l.every((x) => typeof x.url === 'string' && x.url.startsWith('https://') && typeof x.title?.en === 'string');
}

/** Ghat live-stream links: bundled list, then cached, then the latest live.json from the website (edit it during Chhath, no app update needed). */
export function useLiveLinks(): LiveLink[] {
  const [links, setLinks] = useState<LiveLink[]>((bundled as LiveFile).links);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (alive && isValid(parsed)) setLinks(parsed.links);
        }
      } catch {}
      const url = remoteFileUrl('live.json');
      if (!url) return;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (!isValid(json)) return;
        if (alive) setLinks(json.links);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json));
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  return links;
}

export const YOUTUBE_LIVE_SEARCH = 'https://www.youtube.com/results?search_query=chhath+puja+live&sp=EgJAAQ%3D%3D';
export const NEW_MEET = 'https://meet.google.com/new';

/** App deep link plus a web fallback (used on the web app, or when the app isn't installed). */
export interface AppLink {
  app: string;
  web: string;
}

export const whatsAppMessage = (text: string): AppLink => ({
  app: `whatsapp://send?text=${encodeURIComponent(text)}`,
  web: `https://wa.me/?text=${encodeURIComponent(text)}`,
});
export const INSTAGRAM_CAMERA: AppLink = { app: 'instagram://camera', web: 'https://www.instagram.com/' };
export const FACEBOOK_HOME: AppLink = { app: 'fb://feed', web: 'https://m.facebook.com/' };

/** WhatsApp group invite links and call links, the only links that can be pinned. */
export const isWhatsAppGroupLink = (s: string) => /^https:\/\/(chat|call)\.whatsapp\.com\/\S+$/.test(s.trim());
export const isWhatsAppCallLink = (s: string) => s.trim().startsWith('https://call.whatsapp.com/');

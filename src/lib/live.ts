import bundled from '@/data/live.json';
import type { Lang } from './i18n';
import { useRemoteJson } from './remote';

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

function isValid(f: unknown): f is LiveFile {
  const l = (f as LiveFile)?.links;
  return Array.isArray(l) && l.every((x) => typeof x.url === 'string' && x.url.startsWith('https://') && typeof x.title?.en === 'string');
}

/** Ghat live-stream links from live.json (edit it on the website during Chhath, no app update needed). */
export function useLiveLinks(): LiveLink[] {
  return useRemoteJson('live.json', bundled as LiveFile, isValid).links;
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

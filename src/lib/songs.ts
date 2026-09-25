import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import bundled from '@/data/songs.json';
import { SONGS_URL } from './config';
import type { Lang } from './i18n';
import { daysBetween } from './time';

export interface Song {
  date: string;
  youtubeId: string;
  title: Record<Lang, string>;
  album: string;
  channel: string;
  kind: 'song' | 'jukebox';
  note: Record<Lang, string>;
}

export interface SongFile {
  version: number;
  singer: string;
  updated: string;
  songs: Song[];
}

const CACHE_KEY = 'songs-cache-v1';

function isValid(f: unknown): f is SongFile {
  const s = (f as SongFile)?.songs;
  return Array.isArray(s) && s.length > 0 && s.every((x) => typeof x.youtubeId === 'string' && typeof x.date === 'string');
}

function remoteUrl(): string {
  if (Platform.OS === 'web') {
    const base = (Constants.expoConfig?.experiments as { baseUrl?: string } | undefined)?.baseUrl ?? '';
    return `${base}/songs.json`;
  }
  return SONGS_URL;
}

/** Bundled songs first, then a cached copy, then the latest remote copy (so a broken video can be swapped by editing songs.json online). */
export function useSongs(): SongFile {
  const [file, setFile] = useState<SongFile>(bundled as SongFile);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (alive && isValid(parsed) && parsed.updated >= (bundled as SongFile).updated) setFile(parsed);
        }
      } catch {}
      const url = remoteUrl();
      if (!url) return;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (!isValid(json)) return;
        if (alive) setFile(json);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json));
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  return file;
}

export interface SongForDay {
  song: Song;
  /** True when the date is inside the curated daily series. */
  scheduled: boolean;
}

export function sortedSongs(f: SongFile): Song[] {
  return [...f.songs].sort((a, b) => a.date.localeCompare(b.date));
}

/** The song for a date. Outside the curated series we cycle through the list so there is always a song of the day. */
export function songForDate(f: SongFile, date: string): SongForDay {
  const list = sortedSongs(f);
  const exact = list.find((s) => s.date === date);
  if (exact) return { song: exact, scheduled: true };
  const n = list.length;
  const i = ((daysBetween(list[0].date, date) % n) + n) % n;
  return { song: list[i], scheduled: false };
}

export function seriesBounds(f: SongFile) {
  const list = sortedSongs(f);
  return { start: list[0].date, end: list[list.length - 1].date };
}

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

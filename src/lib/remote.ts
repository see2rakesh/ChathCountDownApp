import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { remoteFileUrl } from './config';

/**
 * A data file published next to the web app (live.json, playlist.json): the bundled copy first,
 * then the cached copy, then the latest one from the website, so it can be edited without an app update.
 */
export function useRemoteJson<T>(file: string, bundled: T, isValid: (f: unknown) => f is T): T {
  const [data, setData] = useState<T>(bundled);

  useEffect(() => {
    let alive = true;
    const cacheKey = `${file}-cache-v1`;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (alive && isValid(parsed)) setData(parsed);
        }
      } catch {}
      const url = remoteFileUrl(file);
      if (!url) return;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (!isValid(json)) return;
        if (alive) setData(json);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(json));
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, [file, bundled, isValid]);

  return data;
}

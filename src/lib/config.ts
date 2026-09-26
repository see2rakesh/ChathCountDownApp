import Constants from 'expo-constants';
import { Platform } from 'react-native';

type Extra = { songsUrl?: string; shareUrl?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

/**
 * Remote copy of songs.json. Edit this file in your GitHub repo to change a song without releasing a new APK.
 * Set `expo.extra.songsUrl` in app.json (e.g. https://<user>.github.io/ChathCountDownApp/songs.json).
 */
export const SONGS_URL: string = extra.songsUrl ?? '';
/** Link shown in "Share the app". */
export const SHARE_URL: string = extra.shareUrl ?? '';
export const APP_VERSION: string = Constants.expoConfig?.version ?? '1.0.0';

/** A data file published next to the web app (songs.json, live.json). Empty when no remote URL is configured. */
export function remoteFileUrl(name: string): string {
  if (Platform.OS === 'web') {
    const base = (Constants.expoConfig?.experiments as { baseUrl?: string } | undefined)?.baseUrl ?? '';
    return `${base}/${name}`;
  }
  return SONGS_URL ? SONGS_URL.slice(0, SONGS_URL.lastIndexOf('/') + 1) + name : '';
}

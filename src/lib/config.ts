import Constants from 'expo-constants';

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

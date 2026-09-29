import bundled from '@/data/playlist.json';
import type { Lang } from './i18n';
import { useRemoteJson } from './remote';

/**
 * Chhath geet by several singers. Copyright: every entry must be a video on the label's or artist's
 * official YouTube channel that allows embedding; it plays in YouTube's own player (no downloads,
 * no lyrics or singer photos bundled). `npm run check-videos` verifies channel and embeddability.
 */
export interface PlaylistSong {
  youtubeId: string;
  singer: string;
  /** Official channel name exactly as YouTube reports it. */
  channel: string;
  title: Record<Lang, string>;
  jukebox?: boolean;
}

export interface Singer {
  id: string;
  name: Record<Lang, string>;
}

export interface PlaylistFile {
  updated: string;
  singers: Singer[];
  songs: PlaylistSong[];
}

function isValid(f: unknown): f is PlaylistFile {
  const p = f as PlaylistFile;
  return (
    Array.isArray(p?.singers) &&
    Array.isArray(p?.songs) &&
    p.songs.length > 0 &&
    p.songs.every((s) => typeof s.youtubeId === 'string' && typeof s.channel === 'string' && typeof s.title?.en === 'string')
  );
}

export function usePlaylist(): PlaylistFile {
  return useRemoteJson('playlist.json', bundled as PlaylistFile, isValid);
}

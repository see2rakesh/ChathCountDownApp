import * as Location from 'expo-location';

import { DISTRICTS, type District } from './sun';

/** Farther than this from every listed place means we can't pick one sensibly (abroad, only cities are listed). */
const MAX_KM = 250;

export type LocateResult = { ok: true; district: District } | { ok: false; reason: 'denied' | 'outside' | 'error' };

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

export function nearestDistrict(lat: number, lon: number): { district: District; km: number } {
  let best = { district: DISTRICTS[0], km: Infinity };
  for (const d of DISTRICTS) {
    const km = distanceKm(lat, lon, d.lat, d.lon);
    if (km < best.km) best = { district: d, km };
  }
  return best;
}

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

/**
 * Finds the district HQ nearest to the phone, using approximate location only.
 * `ask` shows the permission prompt if it hasn't been answered yet; otherwise it only uses an existing grant.
 * The position is used on the device and never sent anywhere.
 */
export async function locateDistrict(ask: boolean): Promise<LocateResult> {
  try {
    let perm = await Location.getForegroundPermissionsAsync();
    if (!perm.granted && ask && perm.canAskAgain) perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) return { ok: false, reason: 'denied' };

    const pos =
      (await Location.getLastKnownPositionAsync({ maxAge: 6 * 60 * 60 * 1000 }).catch(() => null)) ??
      (await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }), 15000));
    const { district, km } = nearestDistrict(pos.coords.latitude, pos.coords.longitude);
    return km <= MAX_KM ? { ok: true, district } : { ok: false, reason: 'outside' };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

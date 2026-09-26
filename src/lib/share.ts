import { Linking, Platform, Share } from 'react-native';

/** Opens the system share sheet (or the browser's, falling back to the clipboard). */
export function shareText(message: string) {
  if (Platform.OS === 'web') {
    const nav = globalThis.navigator as Navigator | undefined;
    if (nav?.share) nav.share({ text: message }).catch(() => {});
    else nav?.clipboard?.writeText(message).catch(() => {});
    return;
  }
  Share.share({ message }).catch(() => {});
}

/** Opens WhatsApp with the message ready to send; the user picks the chat. */
export function shareOnWhatsApp(message: string) {
  Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`).catch(() => shareText(message));
}

export function openLink(url: string) {
  Linking.openURL(url).catch(() => {});
}

/** Opens an app by deep link, falling back to its website (always the website on web). */
export function openApp(link: { app: string; web: string }) {
  if (Platform.OS === 'web') return openLink(link.web);
  Linking.openURL(link.app).catch(() => openLink(link.web));
}

import { createElement } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { useSettings } from '@/lib/settings';
import { youtubeWatchUrl } from '@/lib/songs';
import { R, S } from './theme';
import { Button } from './ui';

export function YouTubeVideo({ videoId }: { videoId: string }) {
  const { t } = useSettings();
  return (
    <View style={{ gap: S.md }}>
      <View style={styles.frame}>
        {createElement('iframe', {
          key: videoId,
          src: `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1`,
          title: 'YouTube video player',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          referrerPolicy: 'strict-origin-when-cross-origin',
          allowFullScreen: true,
          style: { border: 0, width: '100%', height: '100%' },
        })}
      </View>
      <Button label={`▶  ${t('openYouTube')}`} variant="outline" onPress={() => Linking.openURL(youtubeWatchUrl(videoId))} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: R.md, overflow: 'hidden' },
});

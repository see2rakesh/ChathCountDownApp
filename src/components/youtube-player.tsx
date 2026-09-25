import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useSettings } from '@/lib/settings';
import { youtubeWatchUrl } from '@/lib/songs';
import { R, S } from './theme';
import { Body, Button } from './ui';

export function YouTubeVideo({ videoId }: { videoId: string }) {
  const { t } = useSettings();
  const [width, setWidth] = useState(0);
  const [failedId, setFailedId] = useState<string | null>(null);
  const failed = failedId === videoId;

  return (
    <View style={{ gap: S.md }}>
      <View style={styles.frame} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {failed ? (
          <Body style={{ padding: S.lg, color: '#fff' }}>{t('embedError')}</Body>
        ) : (
          width > 0 && (
            <YoutubePlayer
              key={videoId}
              videoId={videoId}
              width={width}
              height={Math.round((width * 9) / 16)}
              play={false}
              onError={() => setFailedId(videoId)}
              webViewProps={{ allowsFullscreenVideo: true }}
            />
          )
        )}
      </View>
      <Button label={`▶  ${t('openYouTube')}`} variant="outline" onPress={() => Linking.openURL(youtubeWatchUrl(videoId))} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: R.md, overflow: 'hidden', justifyContent: 'center' },
});

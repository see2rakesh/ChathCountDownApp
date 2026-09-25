// Lets CI (GitHub Actions) fill in URLs without editing app.json.
module.exports = ({ config }) => {
  const baseUrl = process.env.WEB_BASE_URL ?? config.experiments?.baseUrl ?? '';
  return {
    ...config,
    experiments: { ...config.experiments, baseUrl },
    extra: {
      ...config.extra,
      songsUrl: process.env.SONGS_URL ?? config.extra?.songsUrl ?? '',
      shareUrl: process.env.SHARE_URL ?? config.extra?.shareUrl ?? '',
    },
  };
};
